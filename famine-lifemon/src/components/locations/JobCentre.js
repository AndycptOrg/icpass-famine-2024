import React, { useState } from 'react'

import { TextField, MenuItem } from '@mui/material';

const JobCentre = ({ setFormData }) => {
    const [type, setType] = useState(0);
    const [result, setResult] = useState(0);
    const [amount, setAmount] = useState(1);

    const roles = [
        'Food Delivery',
        'Cleaner'
    ];

    const FoodDeliveryID = roles.indexOf('Food Delivery');
    const CleanerID = roles.indexOf('Cleaner');

    return (
        <>
            <TextField
                required
                id="type-select"
                size='large'
                value={type}
                label="Role"
                onChange={e => {
                    const value = e.target.value;
                    setType(value);
                    setResult(0);
                    setFormData({
                        food: -1,
                        happiness: -1,
                        money: type === FoodDeliveryID ? 70 :
                            0,
                        charity: 0,
                        married: false,
                    });
                }}
                sx={{ width: '20em' }}
                select
                fullWidth
                margin='dense'
            >
                {
                    roles.map((role, index) => (
                        <MenuItem key={index} value={index}>{role}</MenuItem>
                    ))
                }
            </TextField>
            {
                (type === CleanerID) ?
                // TODO: adjust money based on amount worked
                    <TextField
                        required
                        id="amount-select"
                        size='large'
                        value={amount}
                        label="Amount"
                        onBlur={e => {
                            const value = Math.min(100, Math.max(0, e.target.value));
                            setAmount(value);
                            setFormData({
                            food: -1,
                            happiness: 0,
                            money: value,
                            charity: 0,
                            married: false,
                            });
                        }}
                        onChange={e => {
                            setAmount(e.target.value);
                        }}
                        sx={{width: '20em'}}
                        fullWidth
                        margin='dense'
                        type='number'
                        inputProps={{ min: 0, max: 100 }}
                        /> : null
            }
        </>
    )
}

export default JobCentre;
