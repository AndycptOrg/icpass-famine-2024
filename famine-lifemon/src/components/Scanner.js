import React, { useState } from 'react';
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { Snackbar, Slide, Alert } from '@mui/material';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
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
		outdated: { severity: 'error', message: 'QR code has expired' },
		invalid: { severity: 'error', message: 'Invalid QR code' },
		missing_setup: { severity: 'error', message: 'Database is not set up properly' },
		default: { severity: 'error', message: 'Invalid QR code' },
	};

	const openSnackbar = (reason) => {
		setSnackbar({ open: true, reason });
	}

	const closeSnackbar = () => setSnackbar({ open: false, reason: null });

	const docRef = doc(db, "users", id);
	const appleRef = doc(db, 'stock', 'apple');
	
	const validTimestamp = (timestamp) => 
		true || Math.abs(Date.now() - timestamp) < 60000

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
			// if schooling update present, update education field too
			if (!!data.education && 								// presence of education update
				!!data.education.pass && 							// presence of pass field
				snapshot.education === data.education.requirement) {// education update matches requirement
				updateDoc(docRef, {
					food: increment(data.food),
					happiness: increment(data.happiness),
					money: increment(data.money),
					education: increment(data.education.pass),
					charity: increment(data.charity),
					married: snapshot.married || data.married,
				});
			} else {
				updateDoc(docRef, {
					food: increment(data.food),
					happiness: increment(data.happiness),
					money: increment(data.money),
					charity: increment(data.charity),
					married: snapshot.married || data.married,
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