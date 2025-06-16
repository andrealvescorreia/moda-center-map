import { InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import type { z } from 'zod'
import type boxeSchema from '../../schemas/box'
import type storeSchema from '../../schemas/store'
import BoxeForm from './boxe-form'
import ButtonRounded from './button-rounded'
import StoreForm from './store-form'

type BoxeSchema = z.infer<typeof boxeSchema>
type StoreSchema = z.infer<typeof storeSchema>

interface SellingLocationFormProps {
  onSubmit: (data: BoxeSchema | StoreSchema) => void
  onBack?: () => void
}

export default function SellingLocationForm({
  onSubmit,
  onBack,
}: SellingLocationFormProps) {
  const [locationType, setLocationType] = useState('box')

  return (
    <div className="p-8 space-y-6 w-full">
      <div>
        <InputLabel id="location-type-label">Tipo</InputLabel>

        <Select
          labelId="location-type-label"
          id="location-type"
          label="Tipo"
          defaultValue={'box'}
          value={locationType}
          onChange={(event) => setLocationType(event.target.value)}
          className="w-full text-gray02"
        >
          <MenuItem value="box">Boxe</MenuItem>
          <MenuItem value="store">Loja</MenuItem>
        </Select>
      </div>

      {locationType === 'box' ? (
        <BoxeForm onSubmit={onSubmit}>
          <ActionButtons />
        </BoxeForm>
      ) : (
        <StoreForm onSubmit={onSubmit}>
          <ActionButtons />
        </StoreForm>
      )}
    </div>
  )

  function ActionButtons() {
    return (
      <div className="space-y-4 py-4">
        <ButtonRounded type="submit">Adicionar local</ButtonRounded>
        <button
          type="button"
          className="px-8 py-3 w-full hover:cursor-pointer"
          onClick={onBack}
        >
          Voltar
        </button>
      </div>
    )
  }
}
