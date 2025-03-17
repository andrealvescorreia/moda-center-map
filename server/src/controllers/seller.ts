import type { NextFunction, Request, Response } from 'express'
import type z from 'zod'
import errorsIds from '../../../shared/operation-errors'
import sequelize from '../database'
import Boxe from '../database/models/boxe'
import ProductCategory from '../database/models/product-category'
import Seller from '../database/models/seller'
import Store from '../database/models/store'
import { registerSellerSchema } from '../schemas/sellerSchema'

export async function createSeller(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = registerSellerSchema.parse({
      ...req.body,
      phone_number: req.body.phone_number?.replace(/\D/g, '').trim(),
      name: req.body.name.trim(),
    })
    const errors = await validateNewSeller(parsed)
    if (errors.length > 0) {
      res.status(400).json({ errors })
      return
    }

    const t = await sequelize.transaction()

    try {
      const newSeller = await Seller.create(
        { name: parsed.name, phone_number: parsed.phone_number },
        { transaction: t }
      )
      const boxes = await Boxe.bulkCreate(parsed.sellingLocations.boxes || [], {
        transaction: t,
      })
      await newSeller.$add('boxes', boxes, {
        transaction: t,
      })
      const stores = await Store.bulkCreate(
        parsed.sellingLocations.stores || [],
        { transaction: t }
      )
      await newSeller.$add('stores', stores, {
        transaction: t,
      })

      const seller_product_categories: ProductCategory[] = []
      for (const category of parsed.productCategories || []) {
        const foundCategory = await ProductCategory.findOne({
          where: { category },
        })
        if (foundCategory) seller_product_categories.push(foundCategory)
      }
      await newSeller.$add('product_categories', seller_product_categories, {
        transaction: t,
      })

      await t.commit()
      res.status(201).json(newSeller)
      return
    } catch (error) {
      console.log(error)
      await t.rollback()
      return next(error)
    }
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

async function validateNewSeller({
  name,
  sellingLocations,
  phone_number,
  productCategories,
}: z.infer<typeof registerSellerSchema>) {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  let errors: Array<Object> = []

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

type SellingLocations = z.infer<typeof registerSellerSchema>['sellingLocations']
async function validateSellingLocations(sellingLocations: SellingLocations) {
  const errors = []
  const hasNoSellingLocations = !(
    sellingLocations.boxes?.length || sellingLocations.stores?.length
  )

  if (hasNoSellingLocations) {
    errors.push({
      error: errorsIds.MISSING_SELLING_LOCATION,
      field: 'sellingLocations',
      message: 'A seller must have at least one selling location',
    })
  }

  if (sellingLocations.boxes && sellingLocations.boxes.length > 0) {
    for (let i = 0; i < sellingLocations.boxes.length; i++) {
      const box = sellingLocations.boxes[i]
      if (
        ['blue', 'orange', 'red', 'green'].includes(box.sector_color) &&
        box.box_number > 120
      ) {
        errors.push({
          code: errorsIds.TOO_BIG,
          field: `sellingLocations.boxes.${i}.box_number`,
          message:
            'Box number must be less than 121 for blue, orange, red, and green sectors',
        })
      }

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
  }

  for (const box of sellingLocations.boxes || []) {
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
          name: boxLocation.seller.name,
        },
      })
    }
  }

  for (const store of sellingLocations.stores || []) {
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
          name: storeLocation.seller.name,
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
  if (['blue', 'orange', 'red', 'green'].includes(box.sector_color)) {
    return (
      box.box_number > 32 &&
      box.box_number < 57 &&
      (['G', 'H', 'I', 'J'].includes(box.street_letter) ||
        (box.street_letter === 'F' && isOdd(box.box_number)) ||
        (box.street_letter === 'K' && !isOdd(box.box_number)))
    )
  }
  if (['yellow', 'white'].includes(box.sector_color)) {
    return (
      box.box_number > 72 &&
      box.box_number < 97 &&
      (['G', 'H', 'I', 'J'].includes(box.street_letter) ||
        (box.street_letter === 'F' && isOdd(box.box_number)) ||
        (box.street_letter === 'K' && !isOdd(box.box_number)))
    )
  }
  return false
}

function boxOverlapsWithFoodCourt(box: {
  sector_color: string
  box_number: number
  street_letter: string
}): boolean {
  if (['blue', 'orange', 'red', 'green'].includes(box.sector_color)) {
    return (
      (['A', 'B', 'C', 'D'].includes(box.street_letter) &&
        box.box_number > 88) ||
      (box.street_letter === 'E' &&
        box.box_number > 88 &&
        isOdd(box.box_number))
    )
  }
  if (['yellow', 'white'].includes(box.sector_color)) {
    return (
      (['A', 'B', 'C', 'D'].includes(box.street_letter) &&
        box.box_number > 8 &&
        box.box_number < 41) ||
      (box.street_letter === 'E' &&
        box.box_number > 8 &&
        box.box_number < 41 &&
        !isOdd(box.box_number))
    )
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
        message: `Product category "${category}" is invalid`,
      })
    }
  }
  return errors
}
