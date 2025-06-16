import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import storeSchema from '../../schemas/store'
import { InputField, InputRoot } from '../input'
import SelectOptions from '../select-options'

type StoreSchema = z.infer<typeof storeSchema>

interface StoreFormProps {
  children: React.ReactNode
  onSubmit: (data: StoreSchema) => void
}
export default function StoreForm({ children, onSubmit }: StoreFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreSchema>({
    resolver: zodResolver(storeSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <SelectOptions
        label="Setor"
        register={register('sector_color')}
        options={[
          { value: 'orange', label: 'Laranja' },
          { value: 'blue', label: 'Azul' },
          { value: 'red', label: 'Vermelho' },
          { value: 'green', label: 'Verde' },
          { value: 'yellow', label: 'Amarelo' },
          { value: 'white', label: 'Branco' },
        ]}
      />
      {errors?.sector_color && (
        <p className="font-semibold text-xs text-danger">
          {errors.sector_color.message}
        </p>
      )}

      <label htmlFor="block">Bloco</label>
      <InputRoot>
        <InputField
          type="number"
          id="block"
          {...register('block_number')}
          placeholder="1-9"
        />
      </InputRoot>
      {errors?.block_number && (
        <p className="font-semibold text-xs text-danger">
          {errors.block_number.message}
        </p>
      )}

      <label htmlFor="store">Loja</label>
      <InputRoot>
        <InputField
          type="number"
          id="store"
          {...register('store_number')}
          placeholder="1-19"
        />
      </InputRoot>
      {errors?.store_number && (
        <p className="font-semibold text-xs text-danger">
          {errors.store_number.message}
        </p>
      )}

      {children}
    </form>
  )
}
