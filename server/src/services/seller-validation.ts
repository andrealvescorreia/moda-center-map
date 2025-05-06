import type z from 'zod'
import errorsIds from '../../../shared/operation-errors'
import Boxe from '../database/models/boxe'
import ProductCategory from '../database/models/product-category'
import Seller from '../database/models/seller'
import Store from '../database/models/store'
import type { registerSellerSchema } from '../schemas/sellerSchema'

type NewSellerType = z.infer<typeof registerSellerSchema>
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
  productCategories,
}: NewSellerType) {
  let errors: ValidationError[] = []

  errors = errors.concat(await validateName(name))
  errors = errors.concat(await validateSellingLocations(sellingLocations))
  errors = errors.concat(await validateProductCategories(productCategories))
  return errors
}

async function validateName(name: string) {
  const errors = []
  const seller = await Seller.findOne({
    where: { name },
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
  sellingLocations: NewSellerType['sellingLocations']
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

  errors = errors.concat(await validateBoxes(sellingLocations.boxes))
  errors = errors.concat(await validateStores(sellingLocations.stores))
  return errors
}

async function validateBoxes(
  boxes: NewSellerType['sellingLocations']['boxes']
) {
  const errors = []
  if (!boxes || boxes.length === 0) return []

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i]
    const box_number_tooBig =
      ['blue', 'orange', 'red', 'green'].includes(box.sector_color) &&
      box.box_number > 120

    if (box_number_tooBig) {
      errors.push({
        code: errorsIds.TOO_BIG,
        field: `sellingLocations.boxes.${i}.box_number`,
        message:
          'Box number must be less than 121 for blue, orange, red, and green sectors',
      })
    }

    const letterAorPerror = validateBoxLetterAorP(box, i)
    if (letterAorPerror) errors.push(letterAorPerror)

    if (boxOverlapsWithFoodCourt(box)) {
      errors.push({
        code: errorsIds.INVALID,
        field: `sellingLocations.boxes.${i}`,
        message:
          'This box cannot exist inside Moda Center, otherwise it would overlap with food court',
      })
    }
    if (boxOverlapsWithStores(box)) {
      errors.push({
        code: errorsIds.INVALID,
        field: `sellingLocations.boxes.${i}`,
        message:
          'This box cannot exist inside Moda Center, otherwise it would overlap with stores',
      })
    }
  }

  for (const box of boxes || []) {
    const boxLocation = await Boxe.findOne({
      where: {
        sector_color: box.sector_color,
        box_number: box.box_number,
        street_letter: box.street_letter,
      },
      include: [Seller],
    })
    if (boxLocation) {
      errors.push({
        code: errorsIds.LOCATION_OCCUPIED,
        field: 'sellingLocations.boxes',
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

function validateBoxLetterAorP(
  box: {
    sector_color: string
    box_number: number
    street_letter: string
  },
  index: number
) {
  if (['A', 'P'].includes(box.street_letter)) {
    const isEven = box.box_number % 2 === 0
    const evenSectors =
      box.street_letter === 'A'
        ? ['blue', 'green', 'yellow']
        : ['orange', 'red', 'white']
    const oddSectors =
      box.street_letter === 'A'
        ? ['orange', 'red', 'white']
        : ['blue', 'green', 'yellow']

    if (evenSectors.includes(box.sector_color) && !isEven) {
      return {
        code: errorsIds.INVALID,
        field: `sellingLocations.boxes.${index}.box_number`,
        message: `Street letter ${box.street_letter} of sector ${box.sector_color} must have even box number`,
      }
    }

    if (oddSectors.includes(box.sector_color) && isEven) {
      return {
        code: errorsIds.INVALID,
        field: `sellingLocations.boxes.${index}.box_number`,
        message: `Street letter ${box.street_letter} of sector ${box.sector_color} must have odd box number`,
      }
    }
  }

  return false
}

async function validateStores(
  stores: NewSellerType['sellingLocations']['stores']
) {
  const errors = []
  for (const store of stores || []) {
    //validações lojas externas
    if (
      ['blue', 'orange', 'red', 'green'].includes(store.sector_color) &&
      store.block_number < 8 &&
      store.store_number > 15
    ) {
      errors.push({
        code: errorsIds.TOO_BIG,
        field: 'sellingLocations.stores.0.store_number',
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
        field: 'sellingLocations.stores.0.store_number',
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
        field: 'sellingLocations.stores.0.store_number',
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
        field: 'sellingLocations.stores.0.store_number',
        message:
          'Number must be less than or equal to 18 for blocks between 1 and 4 of this sector',
      })
    }
    if (errors.length > 0) return errors
    // verifica se a loja está ocupada
    const storeLocation = await Store.findOne({
      where: {
        sector_color: store.sector_color,
        block_number: store.block_number,
        store_number: store.store_number,
      },
      include: [Seller],
    })
    if (storeLocation) {
      errors.push({
        code: errorsIds.LOCATION_OCCUPIED,
        field: 'sellingLocations.stores',
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

function isOdd(n: number) {
  return Math.abs(n % 2) === 1
}

function boxOverlapsWithStores(box: {
  sector_color: string
  box_number: number
  street_letter: string
}): boolean {
  const overlapConditions = {
    blue: { range: [33, 56], evenStreet: 'F', oddStreet: 'K' },
    red: { range: [33, 56], evenStreet: 'K', oddStreet: 'F' },
    orange: { range: [33, 56], evenStreet: 'K', oddStreet: 'F' },
    green: { range: [33, 56], evenStreet: 'F', oddStreet: 'K' },
    white: { range: [73, 96], evenStreet: 'K', oddStreet: 'F' },
    yellow: { range: [73, 96], evenStreet: 'F', oddStreet: 'K' },
  }

  const conditions =
    overlapConditions[box.sector_color as keyof typeof overlapConditions]
  if (conditions) {
    const [min, max] = conditions.range
    return (
      box.box_number >= min &&
      box.box_number <= max &&
      (['G', 'H', 'I', 'J'].includes(box.street_letter) ||
        (box.street_letter === conditions.evenStreet &&
          !isOdd(box.box_number)) ||
        (box.street_letter === conditions.oddStreet && isOdd(box.box_number)))
    )
  }

  return false
}

function boxOverlapsWithFoodCourt(box: {
  sector_color: string
  box_number: number
  street_letter: string
}): boolean {
  if (
    ['blue', 'red', 'orange', 'green'].includes(box.sector_color) &&
    ['A', 'B', 'C', 'D'].includes(box.street_letter) &&
    box.box_number > 88
  ) {
    return true
  }
  if (
    ['blue', 'red', 'orange', 'green'].includes(box.sector_color) &&
    box.street_letter === 'E' &&
    box.box_number > 89 &&
    ((['blue', 'green'].includes(box.sector_color) && isOdd(box.box_number)) ||
      (['orange', 'red'].includes(box.sector_color) && !isOdd(box.box_number)))
  ) {
    return true
  }

  if (
    ['yellow', 'white'].includes(box.sector_color) &&
    ['A', 'B', 'C', 'D'].includes(box.street_letter) &&
    box.box_number > 8 &&
    box.box_number < 41
  ) {
    return true
  }
  if (
    ['white', 'yellow'].includes(box.sector_color) &&
    box.street_letter === 'E' &&
    box.box_number > 9 &&
    box.box_number < 41 &&
    (box.sector_color === 'white'
      ? !isOdd(box.box_number)
      : isOdd(box.box_number))
  ) {
    return true
  }
  return false
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
