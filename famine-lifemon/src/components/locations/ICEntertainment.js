import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const ICEntertainment = ({ setFormData }) => {
  const [type, setType] = useState(true);
  const [result, setResult] = useState(true);

  const ActressSingerID = true;
  // const InfluencerID = false;

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
            happiness: 2,
            money: -50,
            charity: 0,
            married: false,
          });
        }}
        sx={{width: '20em'}}
        select
        fullWidth
        margin='dense'
      >
        <MenuItem key={0} value={true}>KTV</MenuItem>
      </TextField>
    </>
  )
}

export default ICEntertainment;
