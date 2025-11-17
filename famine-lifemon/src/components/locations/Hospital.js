import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const Hospital = ({ setFormData }) => {
  const [type, setType] = useState(true);
  const [amount, setAmount] = useState(1);

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
            food: -1,
            happiness: -1,
            money: type ? amount * 30 : amount * 50,
            charity: 0,
            married: false,
          });
        }}
        sx={{width: '20em'}}
        select
        fullWidth
        margin='dense'
      >
        <MenuItem key={0} value={true}>Nurse</MenuItem>
        <MenuItem key={1} value={false}>Surgeon</MenuItem>
      </TextField>
      <TextField
        required
        id="amount-select"
        size='large'
        value={amount}
        label="Amount"
        onChange={e => {
          const value = e.target.value;
          setAmount(value);
          setFormData({
            food: -1,
            happiness: -1,
            money: type ? amount * 30 : amount * 100,
            charity: 0,
            married: false,
          });
        }}
        sx={{width: '20em'}}
        select
        fullWidth
        margin='dense'
      >
        {
          (Array.from({length: 10}, (_, i) => i + 1)).map(i => 
            <MenuItem key={i} value={i}>{i}</MenuItem>
          )
        }
      </TextField>
    </>
  )
}

export default Hospital;
