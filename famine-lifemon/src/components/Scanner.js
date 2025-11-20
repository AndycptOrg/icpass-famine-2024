import React, { useState } from 'react';
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { Snackbar, Slide, Alert } from '@mui/material';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { verify } from 'jsonwebtoken';

import { db } from '../database/firebase';
import { secret } from './secret/Secret';

export default function Scanner({ setChecked, snapshot, id }) {
	const [poorOpen, setPoorOpen] = useState(false);
	const [uneducatedOpen, setUneducatedOpen] = useState(false);
	const [failOpen, setFailOpen] = useState(false);
	const [bankOpen, setBankOpen] = useState(false);

	const docRef = doc(db, "users", id);
	const appleRef = doc(db, 'stock', 'apple');
	
	const validTimestamp = (timestamp) => 
		Math.abs(Date.now() - timestamp) < 60000

	const handleScan = async (result) => {
		if (!result) {
			return;
		}
		try {
			const data = verify(result.text, secret);
			if (!validTimestamp(data.timestamp)) {
				setFailOpen(true);
				return;
			}
			if (data.header !== 'famine-2023-lifemon') {
				return;
			}
			if (snapshot.food + data.food < 0) {
				setPoorOpen(true);
				return;
			}
			if (snapshot.happiness + data.happiness < 0) {
				setPoorOpen(true);
				return;
			}
			if (snapshot.money + data.money < 0) {
				setPoorOpen(true);
				return;
			}
			if (!!data.education && snapshot.education !== data.education.original) {
				setUneducatedOpen(true);
				return;
			}
			if (!!data.foodBank) {
				const appleSnap = await getDoc(appleRef);
				if (appleSnap.data().amount + data.foodBank < 0) {
					setBankOpen(true);
					return;
				}
				updateDoc(appleRef, {
					amount: increment(data.foodBank),
				})
			}
			if (!!data.education) {
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
			setFailOpen(true);
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
				open={failOpen}
				autoHideDuration={2000}
				onClose={
					(e) => setFailOpen(false)
				}
				TransitionComponent={Slide}
			>
				<Alert 
					severity="error" 
					sx={{width: '100%'}}
					onClose={
						(e) => setFailOpen(false)
					}
				>
					Invalid QR code
				</Alert>
			</Snackbar>
			<Snackbar
				open={uneducatedOpen}
				autoHideDuration={2000}
				onClose={
					(e) => setUneducatedOpen(false)
				}
				TransitionComponent={Slide}
			>
				<Alert 
					severity="error" 
					sx={{width: '100%'}}
					onClose={
						(e) => setUneducatedOpen(false)
					}
				>
					You are not educated enough to do this
				</Alert>
			</Snackbar>
			<Snackbar
				open={poorOpen}
				autoHideDuration={2000}
				onClose={
					(e) => setPoorOpen(false)
				}
				TransitionComponent={Slide}
			>
				<Alert
					severity='warning'
					sx={{width: '100%'}}
					onClose={
						(e) => setPoorOpen(false)
					}
				>
					You cannot afford this
				</Alert>
			</Snackbar>
			<Snackbar
				open={bankOpen}
				autoHideDuration={2000}
				onClose={
					(e) => setBankOpen(false)
				}
				TransitionComponent={Slide}
			>
				<Alert 
					severity="error" 
					sx={{width: '100%'}}
					onClose={
						(e) => setBankOpen(false)
					}
				>
					Food bank has no apples left
				</Alert>
			</Snackbar>
		</>
	);
}