import React, { useState } from 'react'

import LocationRenderer from './LocationRenderer';

const FoodBank = ({ setFormData }) => {
  const [type, setType] = useState(-1);
  const [amount, setAmount] = useState(-1);
  const [price, setPrice] = useState(-100);

  const roles = ['Customer', 'Donor', 'Recipient'];
  const CustomerID = roles.indexOf('Customer');
  const DonorID = roles.indexOf('Donor');
  const RecipientID = roles.indexOf('Recipient');

  const handleRoleChange = e => {
    const role = Number(e.target.value);
    setType(role);
    setFormData({
      food: role === CustomerID ? amount : role === DonorID ? -amount : role === RecipientID ? 1 : undefined,
      foodBank: role === CustomerID ? 0 : role === DonorID ? amount : role === RecipientID ? -1 : undefined,
      happiness: role === CustomerID ? amount : role === DonorID ? amount * 5 : role === RecipientID ? 3 : undefined,
      money: role === CustomerID ? amount * price : role === DonorID || role === RecipientID ? 0 : undefined,
      charity: role === CustomerID ? 0 : role === DonorID ? amount * 5 : role === RecipientID ? 2 : undefined,
      married: false,
    });
  }

  const handleAmountChange = e => {
    const value = Number(e.target.value);
    setAmount(value);
    setFormData({
      food: type === CustomerID ? value : -value,
      foodBank: type === DonorID ? value : 0,
      happiness: type === CustomerID ? value : value * 5,
      money: type === CustomerID ? value * price : 0,
      charity: type === DonorID ? 5 * value : 0,
      married: false,
    });
  }

  const handlePriceChange = e => {
    const value = Number(e.target.value);
    setPrice(value);
    setFormData({
      food: amount,
      foodBank: 0,
      happiness: amount,
      money: amount * value,
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
    (type === CustomerID || type === DonorID) ? {
      id: 'amount-select',
      label: 'Amount of Food',
      value: amount,
      onChange: handleAmountChange,
      select: true,
      options: (Array.from({ length: 5 }, (_, i) => i + 1)).map(i => ({ value: i, label: String(i) })),
      sx: { width: '20em' },
      required: true,
    } : null,
    type === CustomerID ? {
      id: 'price-select',
      label: 'Price',
      value: price,
      onChange: handlePriceChange,
      select: true,
      options: [ { value: -100, label: '$100' }, { value: -125, label: '$125' }, { value: -150, label: '$150' } ],
      sx: { width: '20em' },
      required: true,
    } : null,
  ].filter(Boolean);

  return <LocationRenderer controls={controls} />
}

export default FoodBank;
