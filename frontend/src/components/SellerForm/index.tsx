import { useNetworkState } from '@uidotdev/usehooks'
import { useState } from 'react'
import { useUserContext } from '../../providers/UserProvider'
import type { BoxeSchema } from '../../schemas/box'
import type { StoreSchema } from '../../schemas/store'
import LandingPage from '../landing-page'
import OfflineScreen from '../offline-screen'
import SellerFormStepOne from './step-one'
import SellerFormStepTwo from './step-two'

export interface SellerFormProps {
  onSubmit: (seller: {
    name: string
    phone_number?: string | undefined
    boxes: BoxeSchema[]
    stores: StoreSchema[]
    product_categories: string[]
  }) => void
  onCancel: () => void
  defaultSeller?: {
    name: string
    phone_number?: string | undefined
    boxes: BoxeSchema[]
    stores: StoreSchema[]
    product_categories: string[]
  }
}

export default function SellerForm({
  onSubmit,
  onCancel,
  defaultSeller,
}: SellerFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [name, setName] = useState(defaultSeller?.name || '')
  const [phone_number, setPhoneNumber] = useState<string | undefined>(
    defaultSeller?.phone_number || ''
  )
  const [boxes, setBoxes] = useState<BoxeSchema[]>(defaultSeller?.boxes || [])
  const [stores, setStores] = useState<StoreSchema[]>(
    defaultSeller?.stores || []
  )
  const [productCategories, setProductCategories] = useState<string[]>(
    defaultSeller?.product_categories || []
  )
  const { user } = useUserContext()

  const network = useNetworkState()

  if (!network.online) {
    return <OfflineScreen />
  }
  if (!user) return <LandingPage />

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
    setBoxes(boxes)
    setStores(stores)
    const seller = {
      name,
      phone_number: phone_number === '' ? undefined : phone_number,
      boxes,
      stores,
      product_categories,
    }
    onSubmit(seller)
  }

  const onGoBackToStepOne = async ({
    boxes,
    stores,
    product_categories,
  }: StepTwo) => {
    setBoxes(boxes)
    setStores(stores)
    setProductCategories(product_categories)
    setCurrentStep(1)
  }

  return (
    <div className="w-full">
      {(() => {
        switch (currentStep) {
          case 1:
            return (
              <SellerFormStepOne
                onNext={onSubmitStepOne}
                onBack={onCancel}
                defaultValues={{ name, phone_number }}
              />
            )
          case 2:
            return (
              <SellerFormStepTwo
                onNext={onSubmitStepTwo}
                onBack={onGoBackToStepOne}
                sellerName={name}
                defaultValues={{
                  boxes,
                  stores,
                  product_categories: productCategories,
                }}
              />
            )
          default:
            return <h1>Invalid Step</h1>
        }
      })()}
    </div>
  )
}
