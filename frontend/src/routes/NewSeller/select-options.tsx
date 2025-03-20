import { InputLabel, MenuItem, Select } from '@mui/material'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface Option {
  value: string
  label: string
}

interface SelectOptionsProps {
  label: string
  register?: UseFormRegisterReturn
  options: Option[]
}
export default function SelectOptions({
  label,
  register,
  options,
}: SelectOptionsProps) {
  return (
    <div>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>

      <Select
        labelId={`${label}-label`}
        id={label}
        label={label}
        defaultValue={''}
        {...register}
        className="w-full text-gray02"
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
