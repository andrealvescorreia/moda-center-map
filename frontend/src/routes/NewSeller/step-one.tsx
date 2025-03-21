import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'
import { z } from 'zod'
import { InputField, InputRoot } from '../../components/input'
import sellerSchema from '../../schemas/seller'
import ButtonRounded from './button-rounded'

const sellerSchemaStepOne = z.object({
  name: sellerSchema._def.schema.shape.name,
  phone_number: sellerSchema._def.schema.shape.phone_number,
})
type SellerSchemaStepOne = z.infer<typeof sellerSchemaStepOne>

interface SellerFormStepOneProps {
  onNext: (data: SellerSchemaStepOne) => void
  onBack: () => void
}

export default function SellerFormStepOne({
  onNext,
  onBack,
}: SellerFormStepOneProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerSchemaStepOne>({
    resolver: zodResolver(sellerSchemaStepOne),
  })
  const registerWithMask = useHookFormMask(register)
  useEffect(() => {
    console.log(errors)
  }, [errors])

  return (
    <form onSubmit={handleSubmit(onNext)} className="p-8 space-y-6 w-full">
      <h2 className="font-heading text-gray04 font-bold text-2xl">
        Novo Vendedor
      </h2>

      <div className="space-y-3 py-4">
        <div className="space-y-2">
          <label htmlFor="name">Nome</label>
          <InputRoot>
            <InputField id="name" type="text" autoFocus {...register('name')} />
          </InputRoot>

          {errors?.name && (
            <p className="font-semibold text-xs text-danger">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone">Telefone {'(opcional)'}</label>

          <InputRoot>
            <InputField
              id="phone"
              {...registerWithMask('phone_number', ['99 9999-9999'])}
            />
          </InputRoot>
          {errors?.phone_number && (
            <p className="font-semibold text-xs text-danger">
              {errors.phone_number.message}
            </p>
          )}
        </div>
      </div>
      <div className="py-35 mb-0 md:py-3 space-y-3">
        <ButtonRounded
          type="submit"
          disabled={
            errors.name !== undefined || errors.phone_number !== undefined
          }
        >
          Continuar
        </ButtonRounded>

        <button
          type="button"
          className="px-8 py-3 rounded-4xl w-full hover:cursor-pointer"
          onClick={onBack}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
