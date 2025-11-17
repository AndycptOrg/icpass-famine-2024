import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const Corporation = ({ setFormData }) => {
  const [type, setType] = useState(0);
  const [result, setResult] = useState(0);
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
          setResult(0);
          setFormData({
            food: -1,
            happiness: -1,
            money: type === 0 ? 250 : (type === 1 ? 220 : 150),
            charity: 0,
            married: false,
          });
        }}
        sx={{width: '20em'}}
        select
        fullWidth
        margin='dense'
      >
        <MenuItem key={0} value={0}>Banker</MenuItem>
        <MenuItem key={1} value={1}>Logistics Specialist</MenuItem>
      </TextField>
      {
        (type === 1) ?
          <TextField
            required
            id="result-select"
            size='large'
            value={result}
            label="Result"
            onChange={e => {
              const value = e.target.value;
              setResult(value);
              setFormData({
                food: -1,
                happiness: -1,
                money: result === 0 ? 220 : (result === 1 ? 150 : 80),
                charity: 0,
                married: false,
              });
            }}
            sx={{width: '20em'}}
            select
            fullWidth
            margin='dense'
          >
            <MenuItem key={0} value={0}>Advanced</MenuItem>
            <MenuItem key={1} value={1}>Normal</MenuItem>
            <MenuItem key={2} value={2}>Fail</MenuItem>
          </TextField> :
          <TextField
          required
          id="amount-select"
          size='large'
          value={amount}
          label="# Correct"
          onChange={e => {
            const value = e.target.value;
            setAmount(value);
            setFormData({
              food: -1,
              happiness: -1,
              money: amount * 50 + (5 - amount) * 20,
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
            (Array.from({length: 5}, (_, i) => i + 1)).map(i => 
              <MenuItem key={i} value={i}>{i}</MenuItem>
            )
          }
        </TextField>
      }
    </>
  )
}

export default Corporation;
