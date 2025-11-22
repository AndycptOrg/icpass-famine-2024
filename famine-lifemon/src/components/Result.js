import React, { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { db } from '../database/firebase';
import { collection, getDocs } from 'firebase/firestore';

const charitySymbol = "🔥";
const happySymbol = "😄";

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
      usersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const group = data.group - 1;
        groups[group].numMembers++;
        groups[group].happiness += data.happiness;
        groups[group].money += data.money;
        groups[group].food += data.food + data.charityFood;
        groups[group].charity += data.charity;
      });
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
