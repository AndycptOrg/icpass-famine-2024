import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const Factory = ({ setFormData }) => {
  const [amount, setAmount] = useState(-1);

  const handleAmountChange = e => {
    const value = Number(e.target.value);
    setAmount(value);
    setFormData({
      food: -1,
      happiness: -1,
      money: value * 30,
      charity: 0,
    });
  }

  const controls = [
    {
      id: 'amount-select',
      label: 'Amount',
      value: amount,
      onChange: handleAmountChange,
      select: true,
      options: (Array.from({ length: 5 }, (_, i) => i + 1)).map(i => ({ value: i, label: String(i) })),
      sx: { width: '20em' },
      required: true,
    }
  ];

  return <LocationRenderer controls={controls} />
}

export default Factory;
