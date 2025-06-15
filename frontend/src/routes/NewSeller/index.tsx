import { useNetworkState } from '@uidotdev/usehooks'
import { AxiosError } from 'axios'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import errorsCode from '../../../../shared/operation-errors'
import AlertDialog from '../../components/alert-dialog'
import LandingPage from '../../components/landing-page'
import OfflineScreen from '../../components/offline-screen'
import { createSeller } from '../../http/api'
import { useLoadingContext } from '../../providers/LoadingProvider'
import { useUserContext } from '../../providers/UserProvider'
import type { BoxeSchema } from '../../schemas/box'
import sellerSchema from '../../schemas/seller'
import type { StoreSchema } from '../../schemas/store'
import SellerFormStepOne from './step-one'
import SellerFormStepTwo from './step-two'

export default function NewSeller() {
  const [currentStep, setCurrentStep] = useState(1)
  const [name, setName] = useState('')
  const [phone_number, setPhoneNumber] = useState<string | undefined>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Array<string>>([])
  const { user } = useUserContext()
  const { setLoading } = useLoadingContext()
  const navigate = useNavigate()
  const network = useNetworkState()

  if (!network.online) {
    return <OfflineScreen />
  }
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
    product_categories: string[]
  }
  const onSubmitStepTwo = async ({
    boxes,
    stores,
    product_categories,
  }: StepTwo) => {
    const sellingLocations = { boxes, stores }
    const seller = {
      name,
      phone_number: phone_number === '' ? undefined : phone_number,
      sellingLocations,
      product_categories,
    }

    const result = sellerSchema.safeParse(seller)
    if (!result.success) {
      setErrors(result.error.issues.map((err) => err.message))
      setDialogOpen(true)
      return
    }

    try {
      setLoading(true)
      await createSeller(seller)
      enqueueSnackbar('Vendedor criado com sucesso', { variant: 'success' })
      setTimeout(() => {
        navigate('/sellers')
      }, 2000)
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
      setLoading(false)
    }
  }

  const onCancel = () => {
    window.history.back()
  }

  if (!user) return <LandingPage />
  return (
    <div className="flex md:justify-center md:items-center flex-col h-screen">
      <SnackbarProvider />
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
