import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const YellowGambleDrug = ({ setFormData }) => {
  const [type, setType] = useState(0);
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(true);

  const options = [
    'Casino',
    'Drug House',
    'Club',
    'Scammer'
  ];

  const CasinoID = options.indexOf('Casino');
  const DrugHouseID = options.indexOf('Drug House');
  const ClubID = options.indexOf('Club');
  const ScammerID = options.indexOf('Scammer');

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
          setAmount(0);
          setResult(true);
          setFormData({
            food: value === 2 ? -3 : -1,
            happiness: value === 0 ? 2 : value === 1 ? -1 : 5,
            money: value ? 30 : 130,
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
          options.map((option, index) => (
            <MenuItem key={index} value={index}>{option}</MenuItem>
          ))
        }
      </TextField>
      {
        (type === CasinoID) ?
          <TextField
            required
            id="amount-select"
            size='large'
            value={amount}
            label="Amount"
            onBlur={e => {
              const value = Math.min(500, Math.max(-500, e.target.value));
              setAmount(value);
              setFormData({
                food: -1,
                happiness: value < 0 ? -1 : 2,
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
            inputProps={{ min: -500, max: 500 }}
          /> :
          // club or drug house
          (type !== ScammerID) ?
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
              food: type === 1 ? -1 : -3,
              happiness: type === 1 ? -1 : value ? 5 : 0,
              money: type === DrugHouseID ? value ? 500 : -300 : -50,
              charity: 0,
              married: false,
            });
          }}
          sx={{width: '20em'}}
          select
          fullWidth
          margin='dense'
        >
          <MenuItem key={0} value={true}>{ type === 1 ? 'Successful' : 'Win' }</MenuItem>
          <MenuItem key={1} value={false}>{ type === 1 ? 'Fail' : 'Lose' }</MenuItem>
        </TextField>
        // scammer
        : <TextField
            required
            id="amount-select"
            size='large'
            value={amount}
            label="Difficulty"
            onChange={e => {
              const value = e.target.value;
              setAmount(value);
              setFormData({
                food: -1,
                happiness: -1,
                money: 100 + (value * 200),
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
            (['Easy', 'Medium', 'Hard']).map((difficulty, i) => 
              <MenuItem key={i} value={i}>{difficulty}</MenuItem>
            )
          }
        </TextField>
      }
    </>
  )
}

export default YellowGambleDrug;
