import type z from 'zod'
import errorsIds from '../../../shared/operation-errors'
import Boxe from '../database/models/boxe'
import ProductCategory from '../database/models/product-category'
import Seller from '../database/models/seller'
import Store from '../database/models/store'
import type { BoxeType } from '../schemas/boxeSchema'
import type {
  registerSellerSchema,
  updateSellerSchema,
} from '../schemas/sellerSchema'
import type { StoreType } from '../schemas/storeSchema'
import type { ValidationError } from '../schemas/validationErrorType'
import { validateBoxe } from './validate-boxe'
import { validateEntityId } from './validate-id'
import { validateStore } from './validate-store'

type NewSellerType = z.infer<typeof registerSellerSchema>
type UpdateSellerType = z.infer<typeof updateSellerSchema>

export async function validateSellerCreate({
  name,
  sellingLocations,
  phone_number,
  product_categories: productCategories,
}: NewSellerType) {
  let errors: ValidationError[] = []

  errors = errors.concat(await validateName(name))
  errors = errors.concat(await validateSellingLocations(sellingLocations))
  errors = errors.concat(await validateProductCategories(productCategories))
  return errors
}

async function validateSellerId(id: string) {
  return await validateEntityId(id, Seller)
}

export async function validateSellerUpdate(
  sellerId: string,
  { name, boxes, stores, phone_number, product_categories }: UpdateSellerType
) {
  let errors: ValidationError[] = []
  errors = errors.concat(await validateSellerId(sellerId))
  if (errors.length > 0) return errors

  errors = errors.concat(await validateName(name, sellerId))

  errors = errors.concat(
    await validateSellingLocations({ boxes, stores }, sellerId)
  )
  errors = errors.concat(await validateProductCategories(product_categories))
  return errors
}

export async function validateSellerDelete(sellerId: string) {
  return await validateSellerId(sellerId)
}

async function findSellerByName(name: string) {
  return await Seller.findOne({
    where: { name },
  })
}

async function validateName(name: string, ignoredId?: string) {
  const errors = []
  const seller = await findSellerByName(name)
  if (seller && seller.id !== ignoredId) {
    errors.push({
      code: errorsIds.ALREADY_IN_USE,
      field: 'name',
      message: 'Seller with this name already exists',
    })
  }
  return errors
}

async function validateSellingLocations(
  sellingLocations: NewSellerType['sellingLocations'],
  ignoredSellerId?: string
) {
  let errors: ValidationError[] = []
  const hasNoSellingLocations = !(
    sellingLocations.boxes?.length || sellingLocations.stores?.length
  )

  if (hasNoSellingLocations) {
    errors.push({
      code: errorsIds.MISSING_SELLING_LOCATION,
      field: 'sellingLocations',
      message: 'A seller must have at least one selling location',
    })
    return errors
  }

  errors = errors.concat(
    await validateSellerBoxes(sellingLocations.boxes || [], ignoredSellerId)
  )
  errors = errors.concat(
    await validateSellerStores(sellingLocations.stores || [], ignoredSellerId)
  )
  return errors
}

async function findBoxe(box: BoxeType) {
  return await Boxe.findOne({
    where: {
      sector_color: box.sector_color,
      box_number: box.box_number,
      street_letter: box.street_letter,
    },
    include: [Seller],
  })
}

async function validateSellerBoxes(
  boxes: BoxeType[],
  ignoredSellerId?: string
): Promise<ValidationError[]> {
  const errors = []
  if (!boxes || boxes.length === 0) return []

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i]
    const boxeErrors = validateBoxe(box)

    const field = `sellingLocations.boxes.${i}`
    for (const boxeError of boxeErrors) {
      const auxBoxeError: ValidationError = {
        ...boxeError,
        field: boxeError.field ? `${field}.${boxeError.field}` : field,
      }
      errors.push(auxBoxeError)
    }
  }
  if (errors.length) return errors

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i]
    const existingBoxe = await findBoxe(box)
    if (existingBoxe && existingBoxe.seller_id !== ignoredSellerId) {
      errors.push({
        code: errorsIds.LOCATION_OCCUPIED,
        field: `sellingLocations.boxes.${i}`,
        message: 'Box already occupied by other seller',
        occupiedBy: {
          id: existingBoxe.seller_id,
          name: existingBoxe.seller?.name,
        },
      })
    }
  }

  return errors
}

async function findStore(store: StoreType) {
  return await Store.findOne({
    where: {
      sector_color: store.sector_color,
      block_number: store.block_number,
      store_number: store.store_number,
    },
    include: [Seller],
  })
}

async function validateSellerStores(
  stores: StoreType[],
  ignoredSellerId?: string
) {
  const errors = []
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i]
    const field = `sellingLocations.stores.${i}`
    const storeErrors = validateStore(store)

    for (const storeError of storeErrors) {
      const auxStoreError: ValidationError = {
        ...storeError,
        field: storeError.field ? `${field}.${storeError.field}` : field,
      }
      errors.push(auxStoreError)
    }
    if (errors.length > 0) return errors
    const existingStore = await findStore(store)
    // verifica se a loja está ocupada
    if (existingStore && existingStore.seller_id !== ignoredSellerId) {
      errors.push({
        code: errorsIds.LOCATION_OCCUPIED,
        field,
        message: 'Store already occupied by other seller',
        occupiedBy: {
          id: existingStore.seller_id,
          name: existingStore.seller?.name,
        },
      })
    }
  }
  return errors
}

async function validateProductCategories(
  product_categories: string[] | undefined
) {
  if (!product_categories) return []
  const errors = []
  for (const category of product_categories) {
    const foundCategory = await ProductCategory.findOne({
      where: { category },
    })
    if (!foundCategory) {
      errors.push({
        code: errorsIds.INVALID,
        field: 'productCategories',
        message: `Product category "${category}" does not exist`,
      })
    }
  }
  return errors
}
