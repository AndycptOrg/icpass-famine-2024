import React, { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { db } from '../database/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const charitySymbol = "🔥";
const happySymbol = "😄";

// marriageBonus: query the `marriages` collection for documents containing this user
// and return 1000 if any active marriage (hasDivorced === false) exists, otherwise 0
const marriageBonus = async (userId) => {
  if (!userId) return 0;
  try {
    const q = query(collection(db, 'marriages'), where('participants', 'array-contains', userId));
    const snap = await getDocs(q);
    let stableMarriages = 0;
    for (const d of snap.docs) {
      const m = d.data();
      if (!m.hasDivorced) stableMarriages++;
    }
    return stableMarriages * 1000;
  } catch (e) {
    console.error('marriageBonus error', e);
    return 0;
  }
}

const renderRows = (rows) => {
  return rows.map(row => {
    return {
      id: row.id,
      happiness: happySymbol.repeat(Math.floor(row.happiness / row.numMembers) || 0),
      charity: charitySymbol.repeat(Math.floor(row.charity / row.numMembers) || 0),
      total: Math.floor((row.charity * 30 + row.money * 20 + row.food * 20 + row.happiness * 30) / row.numMembers || 0),
    };
  });
}

const Result = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const calcGroupTotal = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const groups = [...Array(10).keys()].map(i => {
        return {
          id: i + 1,
          numMembers: 0,
          happiness: 0,
          money: 0,
          food: 0,
          charity: 0,
        };
      });
      // iterate serially so we can await DB checks per user
      for (const docSnap of usersSnapshot.docs) {
        const data = docSnap.data();
        const userId = docSnap.id;
        const group = data.group - 1;
        groups[group].numMembers++;
        groups[group].happiness += data.happiness;
        // compute marriage bonus by consulting marriages collection
        const bonus = await marriageBonus(userId);
        groups[group].money += (data.money || 0) + bonus;
        groups[group].food += (data.food || 0) + (data.charityFood || 0);
        groups[group].charity += (data.charity || 0);
      }
      setRows(renderRows(groups));
    }
    calcGroupTotal();
  }, []);

  return (
    <Paper elevation={6} style={{ background: 'linear-gradient(45deg, #FFE078 10%, #FFC14F 100%)' }} >
      <DataGrid
        columns={[
          { field: 'id', headerName: 'Group', flex: 2 },
          { field: 'happiness', headerName: 'Happiness', flex: 3 },
          { field: 'charity', headerName: 'Charity', flex: 3 },
          { field: 'total', headerName: 'Total', flex: 2 },
        ]}
        rows={rows}
        getRowHeight={() => 'auto'}
        sx={{
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px'
          },
        }}
        hideFooter
      />
    </Paper>
  )
}

export default Result;
