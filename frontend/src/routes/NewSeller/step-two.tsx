import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import { MapPinPlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { z } from 'zod'
import { IconButton } from '../../components/icon-button'
import { getProductCategories } from '../../http/api'
import type boxeSchema from '../../schemas/box'
import type storeSchema from '../../schemas/store'
import ButtonRounded from './button-rounded'
import IconOnlyButton from './icon-only-button'
import SellingLocationForm from './selling-location-form'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

interface ProductCategory {
  id: string
  category: string
}

async function fetchCategories() {
  try {
    const pc = await getProductCategories()
    if (pc.data === undefined) return []
    const categories = pc.data.map(
      (category: ProductCategory) => category.category
    )
    return categories
  } catch (error) {
    console.error(error)
    return []
  }
}

type BoxeSchema = z.infer<typeof boxeSchema>
type StoreSchema = z.infer<typeof storeSchema>

interface StepTwo {
  boxes: BoxeSchema[]
  stores: StoreSchema[]
  productCategories: string[]
}

interface SellerFormStepTwoProps {
  sellerName: string
  phone_number?: string
  onNext: (data: StepTwo) => void
  onBack: () => void
}

export default function SellerFormStepTwo({
  sellerName,
  onNext,
  onBack,
}: SellerFormStepTwoProps) {
  const [isAddingSellingLocation, setIsAddingSellingLocation] = useState(true)
  const [boxes, setBoxes] = useState<BoxeSchema[]>([])
  const [stores, setStores] = useState<StoreSchema[]>([])
  const [productCategories, setProductCategories] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  useEffect(() => {
    async function fetchData() {
      const newCategorias = await fetchCategories()
      if (newCategorias.toString() !== categories.toString()) {
        //prevents infinite loop
        setCategories(newCategorias)
      }
    }
    fetchData()
  }, [categories])

  const handleCategorySelection = (
    event: SelectChangeEvent<typeof productCategories>
  ) => {
    const {
      target: { value },
    } = event
    setProductCategories(typeof value === 'string' ? value.split(',') : value)
  }

  const addBox = (box: BoxeSchema) => setBoxes([...boxes, box])
  const removeBox = (box: BoxeSchema) =>
    setBoxes(boxes.filter((b) => b !== box))
  const removeStore = (store: StoreSchema) =>
    setStores(stores.filter((s) => s !== store))
  const addStore = (store: StoreSchema) => setStores([...stores, store])

  const onAddSellingLocation = (data: BoxeSchema | StoreSchema) => {
    if ('box_number' in data) addBox(data as BoxeSchema)
    else addStore(data as StoreSchema)
    setIsAddingSellingLocation(false)
  }

  const onCancelAddSellingLocation = () => setIsAddingSellingLocation(false)

  if (isAddingSellingLocation) {
    return (
      <div className="">
        <h2 className="font-heading text-gray02 font-bold text-2xl pl-8 pt-4">
          Local de venda
        </h2>
        <SellingLocationForm
          onSubmit={onAddSellingLocation}
          onBack={onCancelAddSellingLocation}
        />
      </div>
    )
  }
  return (
    <div className="space-y-4 w-full p-6">
      <h2 className="font-heading text-gray02 font-bold text-2xl">
        Novo Vendedor
      </h2>
      <p>{sellerName}</p>

      {/* ________________________ */}
      <section className="space-y-3">
        <h3 className="text-gray02 font-bold text-xl">Locais de venda</h3>
        <ul className="space-y-5 pb-4">
          {boxes.map((box) => (
            <li
              className="w-full flex justify-between"
              key={box.sector_color + box.street_letter + box.box_number}
            >
              Rua {box.street_letter}, Box {box.box_number}, Setor{' '}
              {box.sector_color}
              <IconOnlyButton onClick={() => removeBox(box)}>
                <X />
              </IconOnlyButton>
            </li>
          ))}
          {stores.map((store) => (
            <li
              className="w-full flex justify-between"
              key={store.sector_color + store.block_number + store.store_number}
            >
              Bloco {store.block_number}, Loja {store.store_number}, Setor{' '}
              {store.sector_color}
              <IconOnlyButton onClick={() => removeStore(store)}>
                <X />
              </IconOnlyButton>
            </li>
          ))}
        </ul>
        <IconButton
          className="w-full"
          onClick={() => setIsAddingSellingLocation(true)}
        >
          <MapPinPlus />
          Adicionar
        </IconButton>
      </section>

      {/* ________________________ */}
      <section className="space-y-3 pt-5">
        <h3 className="text-gray02 font-bold text-xl">Categorias (opcional)</h3>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={productCategories}
          onChange={handleCategorySelection}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          className="w-full"
        >
          {categories.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={productCategories.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </section>

      <div className="space-y-4 py-30">
        <ButtonRounded
          type="submit"
          onClick={() => onNext({ boxes, stores, productCategories })}
          disabled={boxes.length === 0 && stores.length === 0}
        >
          Confirmar
        </ButtonRounded>
        <button
          type="button"
          className="px-8 py-3 w-full hover:cursor-pointer"
          onClick={onBack}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
