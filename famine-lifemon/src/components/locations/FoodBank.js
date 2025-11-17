import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const FoodBank = ({ setFormData }) => {
  const [type, setType] = useState(0);
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(-100);

  const roles = [
    'Customer',
    'Donor',
    'Recipient'
  ]
  const CustomerID = roles.indexOf('Customer');
  const DonorID = roles.indexOf('Donor');
  const RecipientID = roles.indexOf('Recipient');

  return (
    <>
      <TextField
        required
        id="type-select"
        size='large'
        value={type}
        // deciding role
        label="Role"
        onChange={e => {
          const role = e.target.value;
          setType(role);
          setFormData({
            food: role === CustomerID ? amount :
                  role === DonorID ? -amount :
                  role === RecipientID ? 1 :
                  undefined,
            foodBank: role === CustomerID ? 0 :
                      role === DonorID ? amount :
                      role === RecipientID ? -1 :
                      undefined,
            happiness:  role === CustomerID ? amount :
                        role === DonorID ? amount * 5 :
                        role === RecipientID ? 3 :
                        undefined,
            money:  role === CustomerID ? amount * price :
                    role === DonorID ||
                    role === RecipientID ? 0 :
                    undefined,
            charity:  role === CustomerID ? 0 :
                      role === DonorID ? amount * 5 :
                      role === RecipientID ? 2 :
                      undefined,
            married: false,
          });
        }}
        sx={{width: '20em'}}
        select
        fullWidth
        margin='dense'
      >
        {
          roles.map((role, i) =>
            <MenuItem key={i} value={i}>{role}</MenuItem>
          )
        }
      </TextField>
      {
        (type == CustomerID || type === DonorID) &&
          <TextField
            required
            id="amount-select"
            size='large'
            value={amount}
            label="Amount of Food"
            onChange={e => {
              const value = e.target.value;
              setAmount(value);
              setFormData({
                food: type === 0 ? value : -value,
                foodBank: type === 1 ? value : 0,
                happiness: type === 0 ? value : value * 5,
                money: type === 0 ? value * price : 0,
                charity: type === 1 ? 5 * value : 0,
                married: false,
              });
            }}
            sx={{width: '20em'}}
            select
            fullWidth
            margin='dense'
          >
            {
              (Array.from({length: 5}, (_, i) => i + 1)).map(i => 
                <MenuItem key={i} value={i}>{i}</MenuItem>
              )
            }
          </TextField>
      }
      {
        (type === CustomerID) &&
          <TextField
            required
            id="price-select"
            size='large'
            value={price}
            label="Price"
            onChange={e => {
              const value = e.target.value;
              setPrice(value);
              setFormData({
                food: amount,
                foodBank: 0,
                happiness: amount,
                money: amount * value,
                charity: 0,
                married: false,
              });
            }}
            sx={{width: '20em'}}
            select
            fullWidth
            margin='dense'
          >
            <MenuItem key={0} value={-100}> $100</MenuItem>
            <MenuItem key={1} value={-125}> $125</MenuItem>
            <MenuItem key={2} value={-150}> $150</MenuItem>
          </TextField>
      }
    </>
  )
}

export default FoodBank;
