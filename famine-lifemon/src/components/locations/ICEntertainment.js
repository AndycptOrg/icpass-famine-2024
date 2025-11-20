import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const ICEntertainment = ({ setFormData }) => {
  const [type, setType] = useState(null);

  const handleTypeChange = e => {
    const value = e.target.value === 'true' || e.target.value === true;
    setType(value);
    setFormData({
      food: -1,
      happiness: 2,
      money: -50,
      charity: 0,
      married: false,
    });
  }

  const controls = [
    {
      id: 'type-select',
      label: 'Type',
      value: type,
      onChange: handleTypeChange,
      select: true,
      options: [{ value: true, label: 'KTV' }],
      sx: { width: '20em' },
      required: true,
    }
  ];

  return <LocationRenderer controls={controls} />
}

export default ICEntertainment;
