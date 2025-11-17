import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const CommunityCentre = ({ setFormData }) => {
  const [type, setType] = useState(true);

  const roles = [
    'Recycling Operative',
    'Collecting food waste'
  ];

  const RecyclingOperativeID = roles.indexOf('Recycling Operative');
  const CollectingFoodWasteID = roles.indexOf('Collecting food waste');

  return (
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
          food: 2,
          happiness: 2,
          money: 0,
          charity: 5,
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
  )
}

export default CommunityCentre;
