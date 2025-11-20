import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const Lab = ({ setFormData }) => {
  const [isScientist, setIsScientist] = useState(null);
  const [amount, setAmount] = useState(-1);
  const [result, setResult] = useState(-1);

  const handleRoleChange = e => {
    const value = e.target.value === 'true' || e.target.value === true;
    setIsScientist(value);
    setAmount(-1);
    setResult(-1);
    setFormData({
      food: -1,
      happiness: -1,
      money: value ? 30 : 130,
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
      money: value * 30,
      charity: 0,
      married: false,
    });
  }

  const handleResultChange = e => {
    const value = Number(e.target.value);
    setResult(value);
    setFormData({
      food: -1,
      happiness: -1,
      money: value ? 300 : 120,
      charity: 0,
      married: false,
    });
  }

  const controls = [
    {
      id: 'type-select',
      label: 'Type',
      value: isScientist,
      onChange: handleRoleChange,
      select: true,
      options: [{ value: true, label: 'Scientist' }, { value: false, label: 'Researcher' }],
      sx: { width: '20em' },
      required: true,
    },
    isScientist === null ? null : 
    isScientist ? {
      id: 'amount-select',
      label: 'Amount',
      value: amount,
      onChange: handleAmountChange,
      select: true,
      options: (Array.from({ length: 10 }, (_, i) => i + 1)).map(i => ({ value: i, label: String(i) })),
      sx: { width: '20em' },
      required: true,
    } : {
      id: 'result-select',
      label: 'Result',
      value: result,
      onChange: handleResultChange,
      select: true,
      options: [{ value: 1, label: 'Successful' }, { value: 0, label: 'Fail' }],
      sx: { width: '20em' },
      required: true,
    }
  ].filter(Boolean);

  return <LocationRenderer controls={controls} />
}

export default Lab;
