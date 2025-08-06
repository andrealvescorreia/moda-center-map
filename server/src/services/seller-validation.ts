import { Op } from 'sequelize'
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
import { validateBoxe } from './validate-boxes'

type NewSellerType = z.infer<typeof registerSellerSchema>
type UpdateSellerType = z.infer<typeof updateSellerSchema>
type ValidationError = {
  code: string
  field: string
  message: string
  occupiedBy?: {
    id: string
    name: string
  }
}

export async function validateNewSeller({
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

export async function validateSellerUpdate(
  sellerId: string,
  { name, boxes, stores, phone_number, product_categories }: UpdateSellerType
) {
  let errors: ValidationError[] = []

  errors = errors.concat(await validateName(name, sellerId))

  errors = errors.concat(
    await validateSellingLocations({ boxes, stores }, sellerId)
  )
  errors = errors.concat(await validateProductCategories(product_categories))
  return errors
}

async function validateName(name: string, ignoredId?: string) {
  const errors = []
  const seller = await Seller.findOne({
    where: {
      [Op.and]: [{ name }, ignoredId ? { id: { [Op.ne]: ignoredId } } : {}],
    },
  })
  if (seller) {
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
    await validateBoxes(sellingLocations.boxes || [], ignoredSellerId)
  )
  errors = errors.concat(
    await validateStores(sellingLocations.stores || [], ignoredSellerId)
  )
  return errors
}

async function validateBoxes(
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
    const boxLocation = await Boxe.findOne({
      where: {
        [Op.and]: [
          {
            sector_color: box.sector_color,
            box_number: box.box_number,
            street_letter: box.street_letter,
          },
          ignoredSellerId ? { seller_id: { [Op.ne]: ignoredSellerId } } : {},
        ],
      },
      include: [Seller],
    })
    if (boxLocation) {
      errors.push({
        code: errorsIds.LOCATION_OCCUPIED,
        field: `sellingLocations.boxes.${i}`,
        message: 'Box already occupied by other seller',
        occupiedBy: {
          id: boxLocation.seller_id,
          name: boxLocation.seller?.name,
        },
      })
    }
  }

  return errors
}

async function validateStores(stores: StoreType[], ignoredSellerId?: string) {
  const errors = []
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i]
    const field = `sellingLocations.stores.${i}`
    if (
      ['blue', 'orange', 'red', 'green'].includes(store.sector_color) &&
      store.block_number < 8 &&
      store.store_number > 15
    ) {
      errors.push({
        code: errorsIds.TOO_BIG,
        field: `${field}.store_number`,
        message:
          'Number must be less than or equal to 15 for blocks between 1 and 7 of this sector',
      })
    }
    if (
      ['blue', 'orange'].includes(store.sector_color) &&
      store.block_number === 8 &&
      store.store_number > 14
    ) {
      errors.push({
        code: errorsIds.TOO_BIG,
        field: `${field}.store_number`,
        message:
          'Number must be less than or equal to 14 for block 8 of this sector',
      })
    }
    if (
      ['red', 'green'].includes(store.sector_color) &&
      store.block_number === 8 &&
      store.store_number > 6
    ) {
      errors.push({
        code: errorsIds.TOO_BIG,
        field: `${field}.store_number`,
        message:
          'Number must be less than or equal to 6 for block 8 of this sector',
      })
    }
    if (
      ['yellow', 'white'].includes(store.sector_color) &&
      store.block_number <= 4 &&
      store.store_number > 18
    ) {
      errors.push({
        code: errorsIds.TOO_BIG,
        field: `${field}.store_number`,
        message:
          'Number must be less than or equal to 18 for blocks between 1 and 4 of this sector',
      })
    }
    if (errors.length > 0) return errors
    // verifica se a loja está ocupada
    const storeLocation = await Store.findOne({
      where: {
        [Op.and]: [
          {
            sector_color: store.sector_color,
            block_number: store.block_number,
            store_number: store.store_number,
          },
          ignoredSellerId ? { seller_id: { [Op.ne]: ignoredSellerId } } : {},
        ],
      },
      include: [Seller],
    })
    if (storeLocation) {
      errors.push({
        code: errorsIds.LOCATION_OCCUPIED,
        field,
        message: 'Store already occupied by other seller',
        occupiedBy: {
          id: storeLocation.seller_id,
          name: storeLocation.seller?.name,
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
