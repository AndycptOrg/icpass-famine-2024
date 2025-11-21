import React from 'react'
import { TextField, MenuItem } from '@mui/material'

// Generic renderer - accepts an array of control descriptors and renders MUI fields
// control shape: { id, label, value, onChange, select (bool), options: [{value,label}], sx }
const LocationRenderer = ({ controls = [] }) => {
  return (
    <>
      {controls.map(ctrl => (
        <TextField
          key={ctrl.id}
          id={ctrl.id}
          size={ctrl.size || 'large'}
          value={ctrl.value}
          label={ctrl.label}
          onChange={ctrl.onChange}
          sx={ctrl.sx}
          select={Boolean(ctrl.select)}
          fullWidth={ctrl.fullWidth !== undefined ? ctrl.fullWidth : true}
          margin={ctrl.margin || 'dense'}
          required={Boolean(ctrl.required)}
        >
          {ctrl.select && (ctrl.value === -1 || ctrl.value === null) && (
            <MenuItem value={-1} disabled>Select…</MenuItem>
          )}
          {Array.isArray(ctrl.options) && ctrl.options.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </TextField>
      ))}
    </>
  )
}

export default LocationRenderer
