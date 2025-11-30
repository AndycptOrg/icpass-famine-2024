import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const YellowGambleDrug = ({ setFormData }) => {
  const [type, setType] = useState(-1);
  const [amount, setAmount] = useState(-1);
  const [result, setResult] = useState(-1);

  const options = ['Casino', 'Drug House', 'Club', 'Scammer'];
  const CasinoID = options.indexOf('Casino');
  const DrugHouseID = options.indexOf('Drug House');
  const ClubID = options.indexOf('Club');
  const ScammerID = options.indexOf('Scammer');

  const handleTypeChange = e => {
    const value = Number(e.target.value);
    setType(value);
    setAmount(0);
    setResult(1);
    setFormData({
      food: value === ClubID ? -3 : -1,
      happiness: value === CasinoID ? 2 : value === 1 ? -1 : 5,
      money: value ? 30 : 130,
      charity: 0,
    });
  }

  const handleCasino = e => {
    const value = Math.min(500, Math.max(-500, Number(e.target.value)));
    setAmount(value);
    setFormData({
      food: -1,
      happiness: value < 0 ? -1 : 2,
      money: value,
      charity: 0,
    });
  }

  const handleResultChange = e => {
    const value = Number(e.target.value);
    setResult(value);
    setFormData({
      food: type === 1 ? -1 : -3,
      happiness: type === 1 ? -1 : value ? 5 : 0,
      money: type === DrugHouseID ? (value ? 500 : -300) : -50,
      charity: 0,
    });
  }

  const handleScammerDifficulty = e => {
    const value = Number(e.target.value);
    setAmount(value);
    setFormData({
      food: -1,
      happiness: -1,
      money: 100 + (value * 200),
      charity: 0,
    });
  }

  const controls = [
    {
      id: 'type-select',
      label: 'Type',
      value: type,
      onChange: handleTypeChange,
      select: true,
      options: options.map((o, i) => ({ value: i, label: o })),
      sx: { width: '20em' },
      required: true,
    },
    type === CasinoID ? {
      id: 'amount-select',
      label: 'Amount',
      value: amount,
      onChange: handleCasino,
      select: false,
      sx: { width: '20em' },
      required: true,
      type: 'number',
      inputProps: { min: -500, max: 500 },
    } : type !== ScammerID ? {
      id: 'result-select',
      label: 'Result',
      value: result,
      onChange: handleResultChange,
      select: true,
      options: [ { value: 1, label: type === 1 ? 'Successful' : 'Win' }, { value: 0, label: type === 1 ? 'Fail' : 'Lose' } ],
      sx: { width: '20em' },
      required: true,
    } : {
      id: 'amount-select',
      label: 'Difficulty',
      value: amount,
      onChange: handleScammerDifficulty,
      select: true,
      options: (['Easy', 'Medium', 'Hard']).map((d, i) => ({ value: i, label: d })),
      sx: { width: '20em' },
      required: true,
    }
  ].filter(Boolean);

  return <LocationRenderer controls={controls} />
}

export default YellowGambleDrug;
