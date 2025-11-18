import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const Farm = ({ setFormData }) => {
  const [result, setResult] = useState(1);

  const handleResult = e => {
    const value = Number(e.target.value);
    setResult(value);
    setFormData({
      food: -1,
      happiness: -1,
      money: value ? 150 : 50,
      charity: 0,
      married: false,
    });
  }

  const controls = [
    {
      id: 'result-select',
      label: 'Result',
      value: result,
      onChange: handleResult,
      select: true,
      options: [{ value: 1, label: 'Successful' }, { value: 0, label: 'Fail' }],
      sx: { width: '20em' },
      required: true,
    }
  ];

  return <LocationRenderer controls={controls} />
}

export default Farm;
