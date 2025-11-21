import React, { useState } from 'react';
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { Snackbar, Slide, Alert } from '@mui/material';
import { doc, updateDoc, increment, getDoc, arrayUnion, runTransaction, collection, query, where, getDocs, arrayRemove } from 'firebase/firestore';
import { verify } from 'jsonwebtoken';

import { db } from '../database/firebase';
import { secret } from './secret/Secret';

export default function Scanner({ setChecked, snapshot, id }) {
	// centralized snackbar state: { open, reason }
	const [snackbar, setSnackbar] = useState({ open: false, reason: null });

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
		if (!validTimestamp(data.timestamp)) {
			return { result: 'fail', reason: 'outdated' };
		}
		// non-matching header -> ignore silently (behaviour preserved)
		if (data.header !== 'famine-2023-lifemon') {
			return { result: 'ignore' };
		}
		// affordability checks
		if (snapshot.food + data.food < 0) return { result: 'fail', reason: 'hungry' };
		if (snapshot.happiness + data.happiness < 0) return { result: 'fail', reason: 'sad' };
		if (snapshot.money + data.money < 0) return { result: 'fail', reason: 'poor' };
		// education requirement
		if (!!data.education && 							// education requirement present
			snapshot.education < data.education.requirement)// sufficent education level
			return { result: 'fail', reason: 'uneducated' };
		// food bank availability (async)
		if (!!data.foodBank) {
			try {
				const appleSnap = await getDoc(appleRef);
				if (appleSnap.data().amount + data.foodBank < 0) {
					return { result: 'fail', reason: 'bank' };
				}
				// apply apple stock change as part of validation step
				await updateDoc(appleRef, { amount: increment(data.foodBank) });
			} catch (e) {
				if (e instanceof TypeError && e.message.includes("Cannot read properties of undefined")) {
					return { result: 'fail', reason: 'missing_setup' };
				}
				throw e;
			}
		}

		// marriage/divorce validation: cannot divorce when not married; cannot marry when already married
		if (data.married !== undefined) {
			if (String(data.married).toLowerCase() === 'divorce') {
				if (!snapshot.married) return { result: 'fail', reason: 'not_married' };
			} else {
				// attempting to marry (married contains an id or numeric)
				if (snapshot.married) return { result: 'fail', reason: 'already_married' };
			}
		}
		return { result: 'ok' };
	}

	const handleScan = async (result) => {
		if (!result) return;
		try {
			const data = verify(result.text, secret);
			const check = await validateScanData(data);
			if (check.result === 'ignore') return;
			if (check.result === 'fail') {
				openSnackbar(check.reason);
				return;
			}
			// all validations passed -> apply user updates
			// if married update present, update married field
			if (data.married !== undefined) {
				// If married is a numeric identifier (allocated by Church), record this user's id in marriages/<id>
				const marriedId = data.married;
				try {
					// Divorce flow: remove this user from all marriages, set hasDivorced and award money
					if (String(marriedId).toLowerCase() === 'divorce') {
						try {
							// find all marriages containing this user (reads first)
							const q = query(collection(db, 'marriages'), where('participants', 'array-contains', id));
							const qSnap = await getDocs(q);
							// pre-read the marriage data so all reads happen before writes
							const preReads = qSnap.docs.map(d => ({ id: d.id, data: d.data() }));
							let awardCount = preReads.reduce((acc, r) => (!r.data.hasDivorced ? acc + 1 : acc), 0);
							// run transaction to perform writes only (remove participant and set hasDivorced, update user)
							await runTransaction(db, async (tx) => {
								for (const r of preReads) {
									const mRef = doc(db, 'marriages', r.id);
									// always remove participant and set hasDivorced true
									tx.update(mRef, { participants: arrayRemove(id), hasDivorced: true });
								}
								// award 700 per removed marriage (excluding already-divorced) and mark user as not married
								tx.update(docRef, {
									money: increment(700 * awardCount),
									married: false
								});
							});
						} catch (err) {
							console.error('Failed to process divorce', err);
							openSnackbar('fail');
						}
						setChecked(false);
						return;
					}
					if (typeof marriedId === 'number' || (!isNaN(Number(marriedId)) && String(marriedId).length > 0)) {
						const idStr = String(marriedId);
						const marriagesDocRef = doc(db, 'marriages', idStr);
						// run transaction: initialize/update marriages doc and update user doc atomically
						await runTransaction(db, async (tx) => {
							const marriagesSnap = await tx.get(marriagesDocRef);
							if (!marriagesSnap.exists()) {
								// initialize with participants array and hasDivorced field
								tx.set(marriagesDocRef, {
									participants: [id],
									hasDivorced: false,
								});
							} else {
								// append participant
								tx.update(marriagesDocRef, {
									participants: arrayUnion(id),
								});
							}
							// update user's doc in same transaction
							tx.update(docRef, {
								food: increment(data.food),
								happiness: increment(data.happiness),
								money: increment(data.money),
								charity: increment(data.charity),
								married: typeof data.married === 'number',
							});
						});
					}
				} catch (err) {
					console.error('Failed to record marriage participation', err);
					openSnackbar('fail');
				}
				// setChecked after transaction
				setChecked(false);
				return;
			}
			// if schooling update present, update education field
			if (data.education !== undefined && 								// presence of education update
				data.education.pass !== undefined && 							// presence of pass field
				snapshot.education === data.education.requirement) {// education update matches requirement
				updateDoc(docRef, {
					food: increment(data.food),
					happiness: increment(data.happiness),
					money: increment(data.money),
					education: increment(data.education.pass),
					charity: increment(data.charity),
				});
			} else {
				updateDoc(docRef, {
					food: increment(data.food),
					happiness: increment(data.happiness),
					money: increment(data.money),
					charity: increment(data.charity),
				});
			}
			setChecked(false);
		} catch (e) {
			setSnackbar({ open: true, e });
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
					{(snackbarMap[snackbar.reason] || snackbarMap.default).message}
				</Alert>
			</Snackbar>
		</>
	);
}