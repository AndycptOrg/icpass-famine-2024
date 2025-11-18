import React, { useState } from 'react'

import { MenuItem } from '@mui/material';
import LocationRenderer from './LocationRenderer';

const Church = ({ setFormData }) => {
  const [isMarrying, setIsMarrying] = useState(true);

  const options = ['Marriage', 'Divorce'];
  const MarriageID = options.indexOf('Marriage');
  const DivorceID = options.indexOf('Divorce');

  const handleTypeChange = e => {
    const value = Number(e.target.value);
    const marrying = value === MarriageID;
    setIsMarrying(marrying);
    setFormData({
      food: marrying ? -2 : 0,
      happiness: marrying ? 2 : -2,
      money: marrying ? -500 : 0,
      charity: 0,
      married: marrying,
    });
  }

  const controls = [
    {
      id: 'type-select',
      label: 'Type',
      value: isMarrying ? MarriageID : DivorceID,
      onChange: handleTypeChange,
      select: true,
      options: options.map((o, i) => ({ value: i, label: o })),
      sx: { width: '20em' },
      required: true,
    },
  ];

  return <LocationRenderer controls={controls} />
}
/* query in group and add 3 to the group members to prevent scan*/
export default Church;
