import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const Hospital = ({ setFormData }) => {
  const [isNurse, setIsNurse] = useState(true);
  const [amount, setAmount] = useState(1);

  const handleRoleChange = e => {
    const value = e.target.value === 'true' || e.target.value === true;
    setIsNurse(value);
    setFormData({
      food: -1,
      happiness: -1,
      money: value ? amount * 30 : amount * 50,
      charity: 0,
      married: false,
    });
  }

  const handleAmountChange = e => {
    const value = Number(e.target.value);
    setAmount(value);
    setFormData({
      food: -1,
      happiness: -1,
      money: isNurse ? value * 30 : value * 100,
      charity: 0,
      married: false,
    });
  }

  const controls = [
    {
      id: 'type-select',
      label: 'Type',
      value: isNurse,
      onChange: handleRoleChange,
      select: true,
      options: [ { value: true, label: 'Nurse' }, { value: false, label: 'Surgeon' } ],
      sx: { width: '20em' },
      required: true,
    },
    {
      id: 'amount-select',
      label: 'Amount',
      value: amount,
      onChange: handleAmountChange,
      select: true,
      options: (Array.from({ length: 10 }, (_, i) => i + 1)).map(i => ({ value: i, label: String(i) })),
      sx: { width: '20em' },
      required: true,
    }
  ];

  return <LocationRenderer controls={controls} />
}

export default Hospital;
