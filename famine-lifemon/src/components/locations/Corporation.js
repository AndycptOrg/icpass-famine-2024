import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const Corporation = ({ setFormData }) => {
  const [type, setType] = useState(0);
  const [result, setResult] = useState(0);
  const [amount, setAmount] = useState(1);

  const roles = [
    'Banker',
    'Lawyer'
  ];
  const BankerID = roles.indexOf('Banker');
  const LawyerID = roles.indexOf('Lawyer');

  const results = [
    'Winner',
    'Loser'
  ];

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
            money: type === BankerID ? 250 : (type === LawyerID ? 220 : 150),
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
          roles.map((role, index) => (
            <MenuItem key={index} value={index}>{role}</MenuItem>
          ))
        }
      </TextField>
      {
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
                money: result == 'Winner' ? 350 : 50,
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
              results.map((res, i) => 
                <MenuItem key={i} value={i}>{res}</MenuItem>
              )
            }
          </TextField>
      }
    </>
  )
}

export default Corporation;
