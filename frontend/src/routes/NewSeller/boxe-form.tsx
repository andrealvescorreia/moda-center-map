import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { InputField, InputRoot } from '../../components/input'
import SelectOptions from '../../components/select-options'
import boxeSchema from '../../schemas/box'

type BoxeSchema = z.infer<typeof boxeSchema>

interface BoxeFormProps {
  children: React.ReactNode
  onSubmit: (data: BoxeSchema) => void
}
export default function BoxeForm({ children, onSubmit }: BoxeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoxeSchema>({
    resolver: zodResolver(boxeSchema),
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

      <label htmlFor="street">Rua</label>
      <InputRoot>
        <InputField
          id="street"
          {...register('street_letter')}
          placeholder="A-P"
        />
      </InputRoot>
      {errors?.street_letter && (
        <p className="font-semibold text-xs text-danger">
          {errors.street_letter.message}
        </p>
      )}

      <label htmlFor="box">Box</label>
      <InputRoot>
        <InputField
          type="number"
          id="box"
          {...register('box_number')}
          placeholder="1-128"
        />
      </InputRoot>
      {errors?.box_number && (
        <p className="font-semibold text-xs text-danger">
          {errors.box_number.message}
        </p>
      )}

      {children}
    </form>
  )
}
