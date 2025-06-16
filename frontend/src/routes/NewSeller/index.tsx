import { useNetworkState } from '@uidotdev/usehooks'
import { AxiosError } from 'axios'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import errorsCode from '../../../../shared/operation-errors'
import SellerForm from '../../components/SellerForm'
import AlertDialog from '../../components/alert-dialog'
import LandingPage from '../../components/landing-page'
import OfflineScreen from '../../components/offline-screen'
import { createSeller } from '../../http/api'
import { useLoadingContext } from '../../providers/LoadingProvider'
import { useUserContext } from '../../providers/UserProvider'
import type { BoxeSchema } from '../../schemas/box'
import sellerSchema from '../../schemas/seller'
import type { StoreSchema } from '../../schemas/store'

export default function NewSeller() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Array<string>>([])
  const { user } = useUserContext()
  const { setLoading } = useLoadingContext()
  const navigate = useNavigate()
  const network = useNetworkState()

  if (!network.online) {
    return <OfflineScreen />
  }
  if (!user) return <LandingPage />

  const onSubmit = async (seller: {
    name: string
    phone_number?: string
    boxes: BoxeSchema[]
    stores: StoreSchema[]
    product_categories: string[]
  }) => {
    const sellingLocations = { boxes: seller.boxes, stores: seller.stores }
    const sellerBody = {
      name: seller.name,
      phone_number:
        seller.phone_number === '' ? undefined : seller.phone_number,
      sellingLocations,
      product_categories: seller.product_categories,
    }

    const result = sellerSchema.safeParse(sellerBody)
    if (!result.success) {
      setErrors(result.error.issues.map((err) => err.message))
      setDialogOpen(true)
      return
    }

    try {
      setLoading(true)
      const createdSeller = await createSeller(sellerBody)
      enqueueSnackbar('Vendedor criado com sucesso', { variant: 'success' })
      setTimeout(() => {
        navigate(`/sellers/${createdSeller.data.id}`)
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
    navigate('/sellers')
  }

  return (
    <div className="h-screen flex md:justify-center items-center flex-col w-full ">
      <SnackbarProvider />
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
      <div className="md:w-1/2 w-full">
        <h2 className="font-heading text-gray04 font-bold text-2xl pt-4 flex items-center justify-center">
          Novo Vendedor
        </h2>
        <SellerForm onCancel={onCancel} onSubmit={onSubmit} />
      </div>
    </div>
  )
}
