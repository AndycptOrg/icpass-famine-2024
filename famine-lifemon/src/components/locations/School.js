import React, { useState } from 'react'

import { MenuItem } from '@mui/material';
import LocationRenderer from './LocationRenderer';

const PrimaryLevel = 0;
const SecondaryLevel = 1;
const UniversityLevel = 2;
const GraduateLevel = 3;

const School = ({ setFormData }) => {
  const [type, setType] = useState(-1);
  const [result, setResult] = useState(-1);

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

  // handlers convert input into the canonical form data
  const handleTypeChange = e => {
    const value = Number(e.target.value);
    setType(value);
    setFormData({
      food: - value - 1,
      happiness: -1,
      money: 0,
      education: { requirement: value, pass: result },
      charity: 0,
    });
  }

  const handleResultChange = e => {
    const value = Number(e.target.value);
    setResult(value);
    setFormData({
      food: - type - 1,
      happiness: -1,
      money: 0,
      education: { requirement: type, pass: value },
      charity: 0,
    });
  }

  const handleTeacherLevel = e => {
    const value = Number(e.target.value);
    setResult(value);
    const levelPayouts = { 1: 50, 2: 100, 3: 150, 4: 200 };
    const money = levelPayouts[value] ?? 0;
    setFormData({
      food: -1,
      happiness: -1,
      money,
      charity: 0,
    });
  }

  // descriptor for the renderer
  const controls = [
    {
      id: 'type-select',
      label: 'Type',
      value: type,
      onChange: handleTypeChange,
      select: true,
      options: roles.map((role, index) => ({ value: index, label: role })),
      sx: { width: '20em' },
      required: true,
    },
    // conditional control depending on role
    (type !== TeacherID) ? {
      id: 'result-select',
      label: 'Result',
      value: result,
      onChange: handleResultChange,
      select: true,
      options: [{ value: 1, label: 'Pass' }, { value: 0, label: 'Fail' }],
      sx: { width: '20em' },
      required: true,
    } : {
      id: 'result-select',
      label: 'Level reached',
      value: result,
      onChange: handleTeacherLevel,
      select: true,
      options: levels.map((level, index) => ({ value: index + 1, label: level })),
      sx: { width: '20em' },
      required: true,
    }
  ].filter(Boolean);

  return <LocationRenderer controls={controls} />
}

export default School;

export { PrimaryLevel, SecondaryLevel, UniversityLevel, GraduateLevel };
