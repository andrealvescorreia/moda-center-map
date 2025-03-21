import CircularProgress from '@mui/material/CircularProgress'
import { AxiosError } from 'axios'
import { useState } from 'react'
import type { z } from 'zod'
import { createSeller } from '../../http/api'
import type boxeSchema from '../../schemas/box'
import type storeSchema from '../../schemas/store'
import SellerFormStepOne from './step-one'
import SellerFormStepTwo from './step-two'
type BoxeSchema = z.infer<typeof boxeSchema>
type StoreSchema = z.infer<typeof storeSchema>
import errorsCode from '../../../../shared/operation-errors'
import AlertDialog from '../../components/alert-dialog'
import LandingPage from '../../components/landing-page'
import { useUserContext } from '../../providers/UserProvider'
import sellerSchema from '../../schemas/seller'

export default function NewSeller() {
  const [currentStep, setCurrentStep] = useState(1)
  const [name, setName] = useState('')
  const [phone_number, setPhoneNumber] = useState<string | undefined>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Array<string>>([])
  const [isFetching, setIsFetching] = useState(false)
  const { user } = useUserContext()

  interface StepOne {
    name: string
    phone_number?: string | undefined
  }
  const onSubmitStepOne = ({ name, phone_number }: StepOne) => {
    setName(name)
    setPhoneNumber(phone_number)
    setCurrentStep(2)
  }

  interface StepTwo {
    boxes: BoxeSchema[]
    stores: StoreSchema[]
    productCategories: string[]
  }
  const onSubmitStepTwo = async ({
    boxes,
    stores,
    productCategories,
  }: StepTwo) => {
    const sellingLocations = { boxes, stores }
    const seller = {
      name,
      phone_number: phone_number === '' ? undefined : phone_number,
      sellingLocations,
      productCategories,
    }

    const result = sellerSchema.safeParse(seller)
    if (!result.success) {
      setErrors(result.error.issues.map((err) => err.message))
      setDialogOpen(true)
      return
    }

    try {
      setIsFetching(true)
      await createSeller(seller)
      console.log('Seller created')
    } catch (error: unknown) {
      const errorMessages = []
      if (error instanceof AxiosError && error.response?.data) {
        for (const reqError of error.response.data.errors) {
          if (
            reqError.code === errorsCode.ALREADY_IN_USE &&
            reqError.field === 'name'
          ) {
            errorMessages.push('Um vendedor com o nome informado já existe.')
          } else if (
            reqError.code === errorsCode.LOCATION_OCCUPIED &&
            reqError.field === 'sellingLocations.boxes'
          ) {
            errorMessages.push(
              `Um boxe informado já está ocupado por outro vendedor: ${reqError.occupiedBy.name}.`
            )
          } else if (
            reqError.code === errorsCode.LOCATION_OCCUPIED &&
            reqError.field === 'sellingLocations.stores'
          ) {
            errorMessages.push(
              `Uma loja informada já está ocupada pelo vendedor: ${reqError.occupiedBy.name}`
            )
          } else {
            errorMessages.push(reqError.message)
          }
        }
      }
      if (errorMessages.length === 0) {
        errorMessages.push('Erro desconhecido')
      }
      setErrors(errorMessages)
      setDialogOpen(true)
    } finally {
      setIsFetching(false)
    }
  }

  const onCancel = () => {
    window.history.back()
  }

  if (!user) return <LandingPage />
  return (
    <div className="flex md:justify-center md:items-center flex-col h-screen">
      <div className="md:items-center flex-col h-screen w-full md:w-120 ">
        {dialogOpen && (
          <AlertDialog
            isOpen={true}
            onClose={() => setDialogOpen(false)}
            title={'Erro ao Criar Vendedor'}
          >
            {
              <ul className="list-disc space-y-2 p-2">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            }
          </AlertDialog>
        )}
        {isFetching && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center ">
            <div className=" bg-gray04 opacity-70" />
            <CircularProgress className="opacity-100" />
          </div>
        )}
        {(() => {
          switch (currentStep) {
            case 1:
              return (
                <SellerFormStepOne onNext={onSubmitStepOne} onBack={onCancel} />
              )
            case 2:
              return (
                <SellerFormStepTwo
                  onNext={onSubmitStepTwo}
                  onBack={onCancel}
                  sellerName={name}
                />
              )
            default:
              return <h1>Invalid Step</h1>
          }
        })()}
      </div>
    </div>
  )
}
