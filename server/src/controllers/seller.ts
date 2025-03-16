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
        {
          transaction: t,
        }
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

  for (const box of sellingLocations.boxes || []) {
    const boxLocation = await Boxe.findOne({
      where: {
        sector_color: box.sector_color,
        box_number: box.box_number,
        street_letter: box.street_letter,
      },
    })
    if (boxLocation) {
      const sellerName = await Seller.findOne({
        where: { id: boxLocation.seller_id },
      }).then((seller) => seller?.name)
      errors.push({
        code: errorsIds.LOCATION_OCCUPIED,
        field: 'sellingLocations.boxes',
        message: 'Box already occupied by other seller',
        occupiedBy: {
          id: boxLocation.seller_id,
          name: sellerName,
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
    })
    if (storeLocation) {
      errors.push({
        code: errorsIds.LOCATION_OCCUPIED,
        field: 'sellingLocations.stores',
        message: 'Store already occupied by other seller',
        occupiedBy: {
          id: storeLocation.seller_id,
          name: await Seller.findOne({
            where: { id: storeLocation.seller_id },
          }).then((seller) => seller?.name),
        },
      })
    }
  }
  for (const category of productCategories || []) {
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
