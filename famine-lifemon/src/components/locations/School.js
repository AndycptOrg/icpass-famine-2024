import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const School = ({ setFormData }) => {
  const [type, setType] = useState(0);
  const [result, setResult] = useState(1);

  const roles = [
    'Primary',
    'Secondary',
    'University',
    'Teacher'
  ];
  const PrimaryID = roles.indexOf('Primary');
  const SecondaryID = roles.indexOf('Secondary');
  const UniversityID = roles.indexOf('University');
  const TeacherID = roles.indexOf('Teacher');

  // teacher 1-4 answers answered corresponding to food and happiness penalties and money gain

  const levels = [
    '中一/二',
    '中三',
    '中四',
    '中五'
  ];
  const Level1ID = levels.indexOf('中一/二');
  const Level2ID = levels.indexOf('中三');
  const Level3ID = levels.indexOf('中四');
  const Level4ID = levels.indexOf('中五');

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
            food: - value - 1,
            happiness: -1,
            money: 0,
            education: { original: value, pass: result },
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
        (type !== TeacherID) ?
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
              food: - type - 1,
              happiness: -1,
              money: 0,
              education: { original: type, pass: value },
              charity: 0,
              married: false,
            });
          }}
          sx={{width: '20em'}}
          select
          fullWidth
          margin='dense'
          >
          <MenuItem key={0} value={1}>Pass</MenuItem>
          <MenuItem key={1} value={0}>Fail</MenuItem>
        </TextField> :
        <TextField
          required
          id="result-select"
          size='large'
          value={result}
          label="Level reached"
          onChange={e => {
            const value = e.target.value;
            setResult(value);
            const money = (value) * 50;
            setFormData({
              food: - 1,
              happiness: -1,
              money: money,
              charity: 0,
              married :false,
            });
          }}
          sx={{width: '20em'}}
          select
          fullWidth
          margin='dense'
        >
          {
            levels.map((level, index) => (
              <MenuItem key={index} value={index + 1}>{level}</MenuItem>
            ))
          }
        </TextField>
      }
    </>
  )
}

export default School;
