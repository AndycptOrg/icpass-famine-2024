import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const CommunityCentre = ({ setFormData }) => {
  const [type, setType] = useState(-1);

  const roles = ['Recycling Operative', 'Collecting food waste'];

  const handleTypeChange = e => {
    const value = Number(e.target.value);
    setType(value);
    setFormData({
      food: 2,
      happiness: 2,
      money: 0,
      charity: 5,
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
      options: roles.map((r, i) => ({ value: i, label: r })),
      sx: { width: '20em' },
      required: true,
    }
  ];

  return <LocationRenderer controls={controls} />
}

export default CommunityCentre;
