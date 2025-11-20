import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const BobaShop = ({ setFormData }) => {
  const [result, setResult] = useState(-1);

  const handleVisit = e => {
    const value = Number(e.target.value);
    setResult(value);
    setFormData({
      food: 1,
      happiness: 2,
      money: -100,
      charity: 0,
      married: false,
    });
  }

  const controls = [
    {
      id: 'result-select',
      label: 'Visit',
      value: result,
      onChange: handleVisit,
      select: true,
      options: [{ value: 1, label: 'Visit' }],
      sx: { width: '20em' },
    }
  ];

  return <LocationRenderer controls={controls} />
}

export default BobaShop;
