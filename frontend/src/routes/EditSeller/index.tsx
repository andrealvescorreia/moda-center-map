import { useNetworkState } from '@uidotdev/usehooks'
import { AxiosError } from 'axios'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import errorsCode from '../../../../shared/operation-errors'
import SellerForm from '../../components/SellerForm'
import AlertDialog from '../../components/alert-dialog'
import OfflineScreen from '../../components/offline-screen'
import { updateSeller } from '../../http/api'
import { getSeller } from '../../http/api'
import { useLoadingContext } from '../../providers/LoadingProvider'
import { useUserContext } from '../../providers/UserProvider'
import type { BoxeSchema } from '../../schemas/box'
import type { StoreSchema } from '../../schemas/store'
import updateSellerSchema from '../../schemas/updateSeller'

export default function EditSeller() {
  const { id } = useParams<{ id: string }>()
  const [doneFetching, setDoneFetching] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Array<string>>([])
  const { user } = useUserContext()
  const { setLoading } = useLoadingContext()
  const navigate = useNavigate()
  const network = useNetworkState()
  const [seller, setSeller] = useState<{
    name: string
    phone_number?: string | undefined
    boxes: BoxeSchema[]
    stores: StoreSchema[]
    product_categories: string[]
  }>()

  useEffect(() => {
    if (!id) return
    setLoading(true)

    getSeller(id)
      .then((resSeller) => {
        const sellerBody = {
          ...resSeller,
          product_categories: resSeller.product_categories.map(
            (category) => category.category
          ),
        }
        if (JSON.stringify(seller) !== JSON.stringify(sellerBody)) {
          setSeller(sellerBody)
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
        setDoneFetching(true)
      })
  }, [id, seller, setLoading])

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 500)
    }
  }, [user, navigate])

  if (!network.online) {
    return <OfflineScreen />
  }
  if (!user) return null // redirect to login

  if (!seller && doneFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray02 text-2xl pt-10">Vendedor não encontrado</p>
      </div>
    )
  }

  const onSubmit = async (seller: {
    name: string
    phone_number?: string
    boxes: BoxeSchema[]
    stores: StoreSchema[]
    product_categories: string[]
  }) => {
    const sellerBody = {
      name: seller.name,
      phone_number: seller.phone_number === '' ? null : seller.phone_number,
      boxes: seller.boxes,
      stores: seller.stores,
      product_categories: seller.product_categories,
    }

    const result = updateSellerSchema.safeParse(sellerBody)
    if (!result.success) {
      setErrors(result.error.issues.map((err) => err.message))
      setDialogOpen(true)
      return
    }

    try {
      if (!id) return
      setLoading(true)
      const updatedSeller = await updateSeller(id, sellerBody)
      console.log('updatedSeller', updatedSeller)
      enqueueSnackbar('Vendedor editado com sucesso', { variant: 'success' })
      setTimeout(() => {
        navigate(`/sellers/${updatedSeller.data.id}`)
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
    navigate(-1)
  }

  return (
    <div className="h-screen flex md:justify-center items-center flex-col w-full ">
      <SnackbarProvider />
      {dialogOpen && (
        <AlertDialog
          isOpen={true}
          onClose={() => setDialogOpen(false)}
          title={'Erro ao Editar Vendedor'}
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
          Editar Vendedor
        </h2>
        {seller && (
          <SellerForm
            onCancel={onCancel}
            onSubmit={onSubmit}
            defaultSeller={seller}
          />
        )}
      </div>
    </div>
  )
}
