import React, { useState } from 'react';
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { Snackbar, Slide, Alert } from '@mui/material';
import { doc, getDoc, arrayUnion, runTransaction, collection, query, where, getDocs, arrayRemove, increment } from 'firebase/firestore';
import { verify } from 'jsonwebtoken';

import { db } from '../database/firebase';
import { secret } from './secret/Secret';

export default function Scanner({ setChecked, snapshot, id }) {
	// centralized snackbar state: { open, reason }
	const [snackbar, setSnackbar] = useState({ open: false, reason: null });

	// local rate-limit helpers: store last declared access in localStorage
	const localKey = `lastAccess_${id}`;
	const getLocalLastAccess = () => {
		try { return Number(window.localStorage.getItem(localKey)) || 0; } catch(e) { return 0; }
	}
	const setLocalLastAccess = (ms) => {
		try { window.localStorage.setItem(localKey, String(ms)); } catch(e) {}
	}
	const canSendUpdate = () => Date.now() - getLocalLastAccess() >= 60 * 1000;

	const snackbarMap = {
		uneducated: { severity: 'warning', message: 'You are not educated enough to do this' },
		poor: { severity: 'warning', message: 'You cannot afford this' },
		hungry: { severity: 'warning', message: 'You are too hungry to do this' },
		sad: { severity: 'warning', message: 'You are too unhappy to do this' },
		bank: { severity: 'warning', message: 'Food bank has no apples left' },
		fail: { severity: 'warning', message: 'Failed to perform action' },
		outdated: { severity: 'error', message: 'QR code has expired' },
		invalid: { severity: 'error', message: 'Invalid QR code' },
		missing_setup: { severity: 'error', message: 'Database is not set up properly' },
		rate_limited: { severity: 'warning', message: 'Please wait at least 60 seconds between updates' },
		default: { severity: 'error', message: 'Invalid QR code' },
		already_married: { severity: 'warning', message: 'You are already married and cannot marry again' },
		not_married: { severity: 'warning', message: 'You are not married and cannot divorce' },
	};

	const openSnackbar = (reason) => {
		setSnackbar({ open: true, reason });
	}

	const closeSnackbar = () => setSnackbar({ open: false, reason: null });

	const docRef = doc(db, "users", id);
	const appleRef = doc(db, 'stock', 'apple');
	
	const validTimestamp = (timestamp) => 
		Math.abs(Date.now() - timestamp) < 60000

	// centralised validation: returns { result: 'ok' } | { result: 'ignore' } | { result: 'fail', reason }
	const validateScanData = async (data) => {
		// defensive: timestamp must exist
		if (data === undefined || data.timestamp === undefined || !validTimestamp(data.timestamp)) {
			return { result: 'fail', reason: 'outdated' };
		}
		// non-matching header -> ignore silently (behaviour preserved)
		if (data.header !== 'famine-2023-lifemon') {
			return { result: 'ignore' };
		}
		// affordability checks
		if (data.food !== undefined && snapshot.food + data.food < 0) return { result: 'fail', reason: 'hungry' };
		if (data.happiness !== undefined && snapshot.happiness + data.happiness < 0) return { result: 'fail', reason: 'sad' };
		if (data.money !== undefined && snapshot.money + data.money < 0) return { result: 'fail', reason: 'poor' };
		// education requirement
		if (data.education !== undefined && data.education !== null &&
				snapshot.education < data.education.requirement) // sufficient education level
			return { result: 'fail', reason: 'uneducated' };
		// food bank availability (async)
		if (data.foodBank !== undefined && data.foodBank !== null) {
			try {
				const appleSnap = await getDoc(appleRef);
				if (appleSnap.data().amount + data.foodBank < 0) {
					return { result: 'fail', reason: 'bank' };
				}
				// do not apply changes during validation; actual apple stock updates
				// will be performed inside the transaction where all values are
				// pre-calculated before updates are applied.
			} catch (e) {
				if (e instanceof TypeError && e.message.includes("Cannot read properties of undefined")) {
					return { result: 'fail', reason: 'missing_setup' };
				}
				throw e;
			}
		}

		// marriage/divorce validation: cannot divorce when not married; cannot marry when already married
		if (data.married !== undefined) {
			const marriedStr = String(data.married).toLowerCase();
			if (marriedStr === 'divorce') {
				if (!snapshot.married) return { result: 'fail', reason: 'not_married' };
			} else {
				// attempting to marry (married contains an id or numeric)
				if (snapshot.married) return { result: 'fail', reason: 'already_married' };
			}
		}
		return { result: 'ok' };
	}

	// updateData receives the transaction and scanned data
	const updateData = async (tx, data) => {
		const userUpdatePayload = {};
		// collect marriage doc operations to perform after calculation
		const marriageOps = [];
		let appleNewAmount = null;
		let falseCharity = 0;

		// handle divorce flow: collect marriage docs to update, compute money delta
		if (data.married !== undefined && String(data.married).toLowerCase() === 'divorce') {
			let preReads = null;
			try {
				const q = query(collection(db, 'marriages'), where('participants', 'array-contains', id));
				const qSnap = await getDocs(q);
				preReads = qSnap.docs.map(d => ({ id: d.id, data: d.data() }));
			} catch (e) {
				return { result: 'fail', reason: e.toString() };
			}
			if (!preReads) return { result: 'fail', reason: 'Something happened while reading marriage data' };

			// count how many valid divorces to award
			const awardCount = preReads.reduce((acc, r) => (!r.data.hasDivorced ? acc + 1 : acc), 0);
			// prepare marriage doc updates (do not execute yet)
			for (const r of preReads) {
				const mRef = doc(db, 'marriages', r.id);
				marriageOps.push({ ref: mRef, update: { participants: arrayRemove(id), hasDivorced: true } });
			}
			// compute money outcome for user
			data.money = (snapshot.money === undefined ? 0 : snapshot.money) + 700 * awardCount;
			userUpdatePayload.married = false;
		}

		// handle marry (numeric id) flow
		else if (data.married !== undefined && (typeof data.married === 'number' || (!isNaN(Number(data.married)) && String(data.married).length > 0))) {
			const idStr = String(data.married);
			const marriagesDocRef = doc(db, 'marriages', idStr);
			const marriagesSnap = await tx.get(marriagesDocRef);
			if (!marriagesSnap.exists()) {
				marriageOps.push({ ref: marriagesDocRef, set: { participants: [id], hasDivorced: false } });
			} else {
				marriageOps.push({ update: { participants: arrayUnion(id) } });
			}
			userUpdatePayload.married = typeof data.married === 'number';
		}

		// compute numeric changes based on current user state (pre-calculate all deltas)
		if (data.money !== undefined && userUpdatePayload.money === undefined) {
			userUpdatePayload.money = increment(data.money);
		}

		if (data.happiness !== undefined) {
			userUpdatePayload.happiness = increment(data.happiness);
		}

		// handle education pass
		if (data.education !== undefined && data.education !== null && data.education.pass !== undefined) {
			userUpdatePayload.education = increment(data.education.pass);
		}

		// handle receiving food bank donations: charityFood and food increase
		if (data.foodBank !== undefined && data.food !== undefined && data.food > 0) {
			userUpdatePayload.charityFood = increment(data.food);
			userUpdatePayload.food = increment(data.food);
		}

		// when costing food, cost charityFood first
		if (data.food !== undefined && data.food < 0) {
			const foodCost = -data.food;
			const charityFoodAvailable = snapshot.charityFood;
			const charityFoodCost = Math.min(charityFoodAvailable, foodCost);
			if (data.foodBank !== undefined) {
				falseCharity += charityFoodCost;
			}
			// apply computed reductions
			userUpdatePayload.charityFood = increment(- charityFoodCost);
			userUpdatePayload.food = increment(- foodCost);
		}

		// when updating charity
		if (data.charity !== undefined) {
			userUpdatePayload.charity = increment(data.charity - 5 * falseCharity);
		}

		// declare lastAccess in the update so security rules can validate rate limit
		userUpdatePayload.lastAccess = new Date();

		// handle apple stock update inside transaction if applicable
		if (data.foodBank !== undefined && data.foodBank !== null) {
			const appleSnap = await tx.get(appleRef);
			const currAmount = (appleSnap.exists() && appleSnap.data() && appleSnap.data().amount) ? appleSnap.data().amount : 0;
			appleNewAmount = currAmount + data.foodBank;
		}

		// apply marriage document operations
		for (const op of marriageOps) {
			if (op.set) {
				tx.set(op.ref, op.set);
			} else if (op.update) {
				tx.update(op.ref, op.update);
			}
		}

		// apply apple update if needed
		if (appleNewAmount !== null) {
			tx.update(appleRef, { amount: appleNewAmount });
		}

		// only perform update if payload has keys
		if (Object.keys(userUpdatePayload).length > 0) {
			tx.update(docRef, userUpdatePayload);
		}
		return { result: 'ok' };
	}

	const handleScan = async (result) => {
		if (!result) return;
		try {
			// verify secret
			const data = verify(result.text, secret);

			// client-side rate-limit: avoid attempting update if user recently updated
			if (!canSendUpdate()) {
				openSnackbar('rate_limited');
				return;
			}

			// ensure update can be applied to user
			let check = await validateScanData(data);
			if (check.result === 'ignore') return;
			if (check.result === 'fail') {
				openSnackbar(check.reason);
				return;
			}

			// calculates true updates to user
			check = await runTransaction(db, async (tx) => {
				return updateData(tx, data)
				.catch(e => { return { result: 'fail', reason: e.toString() }; }); // ineffective line
			}).catch(e => { return { result: 'fail', reason: e.toString() }; }); // ineffective line
			// on success, record local declared time so client avoids spamming
			if (check && check.result === 'ok') {
				setLocalLastAccess(Date.now());
			}
			if (check && check.result === 'fail') {
				openSnackbar(check.reason);
			}
			setChecked(false);
		} catch (e) {
			openSnackbar(e.toString());
		}
	}

	return (
		<>
			<QrReader
			scanDelay={1000}
				constraints={{
					facingMode: "environment",
				}}
				onResult={handleScan}
				style={{
					width: '100%'
				}}
			/>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={2000}
				onClose={closeSnackbar}
				TransitionComponent={Slide}
			>
				<Alert
					severity={(snackbarMap[snackbar.reason] || snackbarMap.default).severity}
					sx={{ width: '100%' }}
					onClose={closeSnackbar}
				>
					{snackbarMap.hasOwnProperty(snackbar.reason) ? (snackbarMap[snackbar.reason] || snackbarMap.default).message : snackbar.reason}
				</Alert>
			</Snackbar>
		</>
	);
}