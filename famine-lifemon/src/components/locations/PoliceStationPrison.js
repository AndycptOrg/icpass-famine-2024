import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const PoliceStationPrison = ({ setFormData }) => {
  const [type, setType] = useState(true);
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(0);

  const roles = [
    'Police',
    'Prisoner'
  ];

  const PoliceID = roles.indexOf('Police');
  const PrisonerID = roles.indexOf('Prisoner');

  const outcomes = [
    'betray win',
    'betray lose',
    'stay loyal win',
    'stay loyal lose'
  ];

  return (
    <>
    <TextField
        required
        id="type-select"
        size='large'
        value={type}
        label="Role"
        onChange={e => {
            const value = e.target.value;
            setType(value);
            setResult(0);
        }}
        sx={{ width: '20em' }}
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
      (type === PoliceID) ?
        <TextField
          required
          id="amount-select"
          size='large'
          value={amount}
          label="Caught Criminals"
          onChange={e => {
            const value = e.target.value;
            setAmount(value);
            setFormData({
              food: -1,
              happiness: -1,
              money: 150 + value * 100,
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
          ([...Array(6).keys()]).map(i => 
            <MenuItem key={i} value={i}>{i}</MenuItem>
          )
        }
      </TextField> :
      (type === PrisonerID) ?
    <TextField
        required
        id="amount-select"
        size='large'
        value={amount}
        label="Amount"
        onBlur={e => {
            const value = Math.min(200, Math.max(-150, e.target.value));
            setAmount(value);
            setFormData({
            food: 0,
            happiness: 0,
            money: value,
            charity: 0,
            married: false,
            });
        }}
        onChange={e => {
            setAmount(e.target.value);
        }}
        sx={{width: '20em'}}
        fullWidth
        margin='dense'
        type='number'
        inputProps={{ min: -150, max: 200 }}
        /> :  null
        
    }
    </>
    )
  }
export default PoliceStationPrison;
