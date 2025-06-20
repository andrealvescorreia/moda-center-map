import { useGSAP } from '@gsap/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { gsap } from 'gsap'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'
import { z } from 'zod'
import newSellerSchema from '../../schemas/seller'
import { InputField, InputRoot } from '../input'
import ButtonRounded from './button-rounded'

const sellerSchemaStepOne = z.object({
  name: newSellerSchema._def.schema.shape.name,
  phone_number: newSellerSchema._def.schema.shape.phone_number,
})
type SellerSchemaStepOne = z.infer<typeof sellerSchemaStepOne>

interface SellerFormStepOneProps {
  onNext: (data: SellerSchemaStepOne) => void
  onBack: () => void
  defaultValues?: SellerSchemaStepOne
}

export default function SellerFormStepOne({
  onNext,
  onBack,
  defaultValues,
}: SellerFormStepOneProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerSchemaStepOne>({
    resolver: zodResolver(sellerSchemaStepOne),
  })
  const registerWithMask = useHookFormMask(register)

  const formRef = useRef<HTMLFormElement>(null)
  useGSAP(() => {
    const element = formRef.current
    gsap.fromTo(
      element,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
    )
  })

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      ref={formRef}
      className="p-8 space-y-6 w-full"
    >
      <div className="space-y-3 py-4">
        <div className="space-y-2">
          <label htmlFor="name">Nome</label>
          <InputRoot>
            <InputField
              id="name"
              type="text"
              autoFocus
              {...register('name')}
              defaultValue={defaultValues?.name}
            />
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
              {...registerWithMask('phone_number', ['99 99999-9999'])}
              defaultValue={defaultValues?.phone_number}
            />
          </InputRoot>
          {errors?.phone_number && (
            <p className="font-semibold text-xs text-danger">
              {errors.phone_number.message}
            </p>
          )}
        </div>
      </div>
      <div className="py-15 mb-0 md:py-3 space-y-3">
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
