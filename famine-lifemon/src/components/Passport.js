import React, { useEffect } from 'react';

import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import Stats from './Stats';
import QRBlock from './QRBlock';

import { db } from '../database/firebase';
import Result from './Result';

export default function Passport({ id, result }) {
	const [snapshot, loading, error] = useDocumentData(
		doc(db, "users", id)
	);
	useEffect(() => {
    if (!loading && !snapshot) {
      window.localStorage.clear();
    }
  }, [loading, snapshot]);
	if (error) {
		console.log(JSON.stringify(error));
	}
	return (
		<>
			<Stats snapshot={snapshot} loading={loading} showCharity={result} />
			{
				(result) ?
					<Result /> :
					<QRBlock snapshot={snapshot} loading={loading} id={id} />
			}
			<a href={window.location.href+"?id="+id}>Recovery link</a>(save this link to recover your account)
		</>
	);
}