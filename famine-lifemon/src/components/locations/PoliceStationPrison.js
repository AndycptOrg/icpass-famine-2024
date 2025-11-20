import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const PoliceStationPrison = ({ setFormData }) => {
  const [type, setType] = useState(-1);
  const [amount, setAmount] = useState(-1);

  const roles = ['Police', 'Prisoner'];
  const PoliceID = roles.indexOf('Police');
  const PrisonerID = roles.indexOf('Prisoner');

  const handleRoleChange = e => {
    const value = Number(e.target.value);
    setType(value);
    setAmount(0);
  }

  const handlePoliceAmount = e => {
    const value = Number(e.target.value);
    setAmount(value);
    setFormData({
      food: -1,
      happiness: -1,
      money: 150 + value * 100,
      charity: 0,
      married: false,
    });
  }

  const handlePrisonerAmountBlur = e => {
    const value = Math.min(200, Math.max(-150, Number(e.target.value)));
    setAmount(value);
    setFormData({
      food: 0,
      happiness: 0,
      money: value,
      charity: 0,
      married: false,
    });
  }

  const controls = [
    {
      id: 'type-select',
      label: 'Role',
      value: type,
      onChange: handleRoleChange,
      select: true,
      options: roles.map((r, i) => ({ value: i, label: r })),
      sx: { width: '20em' },
      required: true,
    },
    type === PoliceID ? {
      id: 'amount-select',
      label: 'Caught Criminals',
      value: amount,
      onChange: handlePoliceAmount,
      select: true,
      options: ([...Array(6).keys()]).map(i => ({ value: i, label: String(i) })),
      sx: { width: '20em' },
      required: true,
    } : type === PrisonerID ? {
      id: 'amount-select',
      label: 'Amount',
      value: amount,
      onChange: e => setAmount(Number(e.target.value)),
      onBlur: handlePrisonerAmountBlur,
      select: false,
      sx: { width: '20em' },
      required: true,
      type: 'number',
      inputProps: { min: -150, max: 200 },
    } : null
  ].filter(Boolean);

  return <LocationRenderer controls={controls} />
}
export default PoliceStationPrison;
