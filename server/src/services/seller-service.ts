import { Sequelize } from 'sequelize'
import z from 'zod'
import sequelize from '../database'
import Boxe from '../database/models/boxe'
import ProductCategory from '../database/models/product-category'
import Seller from '../database/models/seller'
import Store from '../database/models/store'
import type { BoxeType } from '../schemas/boxeSchema'
import type { QueryOptionsType } from '../schemas/queryOptionsSchema'
import type { SearchType } from '../schemas/searchSchema'
import type {
  RegisterSellerType,
  UpdateSellerType,
} from '../schemas/sellerSchema'
import type { StoreType } from '../schemas/storeSchema'
import { boxesChanges, storesChanges } from './sell-location-change-detection'
import { validateSellerCreate, validateSellerUpdate } from './validate-seller'

export class SellerService {
  private defaultOrderBy = 'createdAt'
  private defaultOrder = 'DESC'

  async findAll({ order_by, order }: QueryOptionsType) {
    return await Seller.findAll({
      order: [
        [
          order_by ? order_by : this.defaultOrderBy,
          order ? order : this.defaultOrder,
        ],
      ],
      include: this.getDefaultIncludes(),
      attributes: { exclude: this.getDefaultExcludes() },
    })
  }

  async findOne(id: string) {
    return await Seller.findOne({
      where: { id },
      include: this.getDefaultIncludes(),
      attributes: { exclude: this.getDefaultExcludes() },
    })
  }

  async findOneByBoxe(boxe: BoxeType) {
    const existingBoxe = await Boxe.findOne({ where: boxe })
    if (!existingBoxe) return null
    return await this.findOne(existingBoxe.seller_id)
  }

  async findOneByStore(store: StoreType) {
    const existingStore = await Store.findOne({ where: store })
    if (!existingStore) return null
    return await this.findOne(existingStore.seller_id)
  }

  async search({ searchTerm, limit, offset }: SearchType) {
    const results = await Seller.findAll({
      where: Sequelize.literal(`
      search_vector @@ plainto_tsquery('portuguese', :searchTerm)
    `),
      order: Sequelize.literal(`
      ts_rank(search_vector, plainto_tsquery('portuguese', :searchTerm)) DESC
    `),
      limit,
      offset,
      replacements: { searchTerm },
      raw: true,
    })

    return await Seller.findAll({
      where: { id: results.map((result) => result.id) },
      include: this.getDefaultIncludes(),
      attributes: { exclude: this.getDefaultExcludes() },
    })
  }

  async create(seller: RegisterSellerType) {
    const errors = await validateSellerCreate(seller)
    if (errors.length > 0) {
      return { errors }
    }
    const t = await sequelize.transaction()
    try {
      const newSeller = await Seller.create(
        { name: seller.name, phone_number: seller.phone_number },
        { transaction: t }
      )
      const boxes = await Boxe.bulkCreate(seller.sellingLocations.boxes || [], {
        transaction: t,
      })
      await newSeller.$add('boxes', boxes, {
        transaction: t,
      })
      const stores = await Store.bulkCreate(
        seller.sellingLocations.stores || [],
        { transaction: t }
      )
      await newSeller.$add('stores', stores, {
        transaction: t,
      })

      const seller_product_categories: ProductCategory[] = []
      for (const category of seller.product_categories || []) {
        const foundCategory = await ProductCategory.findOne({
          where: { category },
        })
        if (foundCategory) seller_product_categories.push(foundCategory)
      }
      await newSeller.$add('product_categories', seller_product_categories, {
        transaction: t,
      })

      await t.commit()
      return newSeller
    } catch (error) {
      await t.rollback()
      throw error
    }
  }

  async update(seller: UpdateSellerType, id: string) {
    const errors = await validateSellerUpdate(id, seller)
    if (errors.length > 0) return { errors }
    const foundSeller = await this.findOne(id)
    if (!foundSeller) return null
    const t = await sequelize.transaction()
    try {
      await Seller.update(
        {
          name: seller.name,
          phone_number: seller.phone_number ? seller.phone_number : null,
        },
        { where: { id }, transaction: t }
      )

      const { addedBoxes, removedBoxes } = await boxesChanges(
        foundSeller.id,
        seller.boxes
      )
      const { addedStores, removedStores } = await storesChanges(
        foundSeller.id,
        seller.stores
      )

      if (addedBoxes.length > 0) {
        const createdBoxes = await Boxe.bulkCreate(addedBoxes, {
          transaction: t,
        })
        await foundSeller.$add('boxes', createdBoxes, { transaction: t })
      }
      if (removedBoxes.length > 0) {
        await Boxe.destroy({
          where: { id: removedBoxes.map((box) => box.id) },
          transaction: t,
        })
      }
      if (addedStores.length > 0) {
        const createdStores = await Store.bulkCreate(addedStores, {
          transaction: t,
        })
        await foundSeller.$add('stores', createdStores, { transaction: t })
      }
      if (removedStores.length > 0) {
        await Store.destroy({
          where: { id: removedStores.map((store) => store.id) },
          transaction: t,
        })
      }
      const newSellerProductCategories: ProductCategory[] = []
      for (const category of seller.product_categories || []) {
        const foundCategory = await ProductCategory.findOne({
          where: { category },
        })
        if (foundCategory) newSellerProductCategories.push(foundCategory)
      }
      await foundSeller.$add('product_categories', newSellerProductCategories, {
        transaction: t,
      })

      const removedCategories = foundSeller.product_categories.filter(
        ({ category }) =>
          !newSellerProductCategories.some((c) => c.category === category)
      )
      if (removedCategories.length)
        await foundSeller.$remove('product_categories', removedCategories, {
          transaction: t,
        })

      await t.commit()

      return foundSeller
    } catch (error) {
      await t.rollback()
      throw error
    }
  }

  private getDefaultIncludes() {
    return [
      {
        model: Boxe,
        attributes: { exclude: ['createdAt', 'updatedAt', 'seller_id'] },
      },
      {
        model: Store,
        attributes: { exclude: ['createdAt', 'updatedAt', 'seller_id'] },
      },
      {
        model: ProductCategory,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        through: { attributes: [] }, // Exclude the join table (SellerProductCategories) attributes
      },
    ]
  }
  private getDefaultExcludes() {
    return ['createdAt', 'updatedAt', 'search_vector']
  }
}
