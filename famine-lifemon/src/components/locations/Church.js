import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const Church = ({ setFormData }) => {
  const [type, setType] = useState(true);
  // const [result, setResult] = useState(500);

  const options = [
    'Marriage',
    'Divorce'
  ];

  const MarriageID = options.indexOf('Marriage');
  const DivorceID = options.indexOf('Divorce');

  const CoupleID = options.indexOf('Couple');
  const FamilyID = options.indexOf('Family');

  return (
    <>
    <TextField
      required
      id="type-select"
      size='large'
      value={type}
      label="Type"
      onChange={e => {
        const value = e.target.value;
        setType(value);
        setFormData({
          food: value === MarriageID ? -2 : 0,
          happiness: value === MarriageID ? 2 : -2,
          money: value === MarriageID ? -500 : 0,
          charity: 0,
          married: value === MarriageID,
          // food: value === CoupleID ? -3 : 0,
          // happiness: value === CoupleID ? 6 : 3,
          // money: 0,
          // charity: 0,
          // married: value,
        });
      }}
      sx={{width: '20em'}}
      select
      fullWidth
      margin='dense'
      >
      {
        options.map((option, index) => (
          <MenuItem key={index} value={index}>{option}</MenuItem>
        ))
      }
    </TextField>
    {/* {
      (type === MarriageID) &&
        <TextField
          required
          id="result-select"
          size='large'
          value={type}
          label="Amount to vest"
          onChange={e => {
            const value = e.target.value;
            setResult(value);
            setFormData({
              food: -2,
              happiness: 2,
              money: -500,
              charity: 0,
              married: true,
            });
          }}
          sx={{width: '20em'}}
          select
          fullWidth
          margin='dense'
        >
          <MenuItem key={0} value={500}>500</MenuItem>
          <MenuItem key={1} value={1000}>1000</MenuItem>
          <MenuItem key={2} value={1500}>1500</MenuItem>
        </TextField>
    } */}
    </>
  )
}
/* query in group and add 3 to the group members to prevent scan*/
export default Church;
