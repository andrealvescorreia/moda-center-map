import type { NextFunction, Request, Response } from 'express'
import { ZodError, z } from 'zod'
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
    const t = await sequelize.transaction()
    try {
      let { name, sellingLocations, phone_number, productCategories } = req.body

      if (phone_number) phone_number = phone_number.replace(/\D/g, '').trim()

      const parsedSeller = registerSellerSchema.parse({
        name,
        sellingLocations,
        phone_number,
      })

      const newSeller = await Seller.create(
        { name, phone_number },
        { transaction: t }
      )

      const hasNoSellingLocations = !(
        sellingLocations.boxes?.length || sellingLocations.stores?.length
      )

      if (hasNoSellingLocations) {
        await t.rollback()
        res.status(400).json({
          errors: [
            {
              error: errorsIds.MISSING_SELLING_LOCATION,
              field: 'sellingLocations',
              message: 'A seller must have at least one selling location',
            },
          ],
        })
        return
      }

      if (sellingLocations.boxes && sellingLocations.boxes.length > 0) {
        for (let i = 0; i < sellingLocations.boxes.length; i++) {
          const box = sellingLocations.boxes[i]
          // verify if the box location is already occupied
          const boxLocation = await Boxe.findOne({
            where: {
              sector_color: box.sector_color,
              box_number: box.box_number,
              street_letter: box.street_letter,
            },
          })
          if (boxLocation) {
            await t.rollback()
            res.status(400).json({
              errors: [
                {
                  code: errorsIds.LOCATION_OCCUPIED,
                  field: 'sellingLocations.boxes',
                  message: 'Box already occupied by other seller',
                  occupiedBy: {
                    id: boxLocation.seller_id,
                    name: await Seller.findOne({
                      where: { id: boxLocation.seller_id },
                    }).then((seller) => seller?.name),
                  },
                },
              ],
            })
            return
          }
        }

        const boxes = await Boxe.bulkCreate(sellingLocations.boxes, {
          transaction: t,
        })
        await newSeller.$add('boxes', boxes, {
          transaction: t,
        })
      }
      if (sellingLocations.stores && sellingLocations.stores.length > 0) {
        for (let i = 0; i < sellingLocations.stores.length; i++) {
          const store = sellingLocations.stores[i]
          // verify if the box location is already occupied
          const storeLocation = await Store.findOne({
            where: {
              sector_color: store.sector_color,
              block_number: store.block_number,
              store_number: store.store_number,
            },
          })
          if (storeLocation) {
            await t.rollback()
            res.status(400).json({
              errors: [
                {
                  code: errorsIds.LOCATION_OCCUPIED,
                  field: 'sellingLocations.stores',
                  message: 'Store already occupied by other seller',
                  occupiedBy: {
                    id: storeLocation.seller_id,
                    name: await Seller.findOne({
                      where: { id: storeLocation.seller_id },
                    }).then((seller) => seller?.name),
                  },
                },
              ],
            })
            return
          }
        }
        const stores = await Store.bulkCreate(sellingLocations.stores, {
          transaction: t,
        })
        await newSeller.$add('stores', stores, {
          transaction: t,
        })
      }
      if (productCategories && productCategories.length > 0) {
        const seller_product_categories: ProductCategory[] = []
        for (const category of productCategories) {
          const foundCategory = await ProductCategory.findOne({
            where: { category },
          })
          if (foundCategory) {
            seller_product_categories.push(foundCategory)
          } else {
            await t.rollback()
            res.status(400).json({
              errors: [
                {
                  code: errorsIds.INVALID,
                  field: 'productCategories',
                  message: `Product category "${category}" is invalid`,
                },
              ],
            })
            return
          }
        }
        await newSeller.$add('product_categories', seller_product_categories, {
          transaction: t,
        })
      }

      await t.commit()
      res.status(201).json(newSeller)
      return
    } catch (error) {
      console.log(error)
      //if (!t.finished) await t.rollback()
      return next(error)
    }
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
