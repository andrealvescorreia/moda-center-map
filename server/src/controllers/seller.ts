import type { NextFunction, Request, Response } from 'express'
import { Sequelize } from 'sequelize'
import z from 'zod'
import sequelize from '../database'
import Boxe from '../database/models/boxe'
import ProductCategory from '../database/models/product-category'
import Seller from '../database/models/seller'
import Store from '../database/models/store'
import User from '../database/models/user'
import { boxeSchema } from '../schemas/boxeSchema'
import { queryOptionsSchema } from '../schemas/queryOptionsSchema'
import { type SearchType, searchSchema } from '../schemas/searchSchema'
import {
  registerSellerSchema,
  updateSellerSchema,
} from '../schemas/sellerSchema'
import { storeSchema } from '../schemas/storeSchema'
import {
  boxesChanges,
  storesChanges,
} from '../services/sell-location-change-detection'
import {
  validateSellerCreate,
  validateSellerUpdate,
} from '../services/validate-seller'

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = queryOptionsSchema.parse(req.query)
    const sellers = await Seller.findAll({
      order: [
        [
          parsed.order_by ? parsed.order_by : 'createdAt',
          parsed.order ? parsed.order : 'DESC',
        ],
      ],
      include: [
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
          through: { attributes: [] }, // Exclude the join table attributes (SellerProductCategories)
        },
      ],
      attributes: { exclude: ['updatedAt', 'search_vector'] },
    })
    res.status(200).json(sellers)
    return
  } catch (error) {
    return next(error)
  }
}

async function findSellerById(id: string) {
  return await Seller.findOne({
    where: { id },
    include: [
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
        through: { attributes: [] },
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'search_vector'] },
  })
}

async function findSellerByReqId(req: Request, res: Response) {
  if (!z.string().uuid().safeParse(req.params.id).success) {
    res.status(400).json({ message: 'Invalid id' })
    return
  }
  const seller = await findSellerById(req.params.id)
  if (!seller) {
    res.status(404).json({ message: 'Seller not found' })
    return
  }
  return seller
}

const findUserByReqId = async (req: Request, res: Response) => {
  const user_id = req.body.userId
  if (!user_id) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  const user = await User.findOne({ where: { id: user_id } })
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }
  return user
}

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    const seller = await findSellerByReqId(req, res)
    if (!seller) return
    res.status(200).json(seller)
    return
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

export async function showByBoxe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = boxeSchema.parse(req.query)
    const boxe = await Boxe.findOne({
      where: parsed,
      include: [Seller],
    })
    if (!boxe) {
      res.status(404).json({ message: 'This boxe does not belong to a seller' })
      return
    }

    const seller = await findSellerById(boxe.seller_id)

    res.status(200).json(seller)
    return
  } catch (error) {
    return next(error)
  }
}

export async function showByStore(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = storeSchema.parse(req.query)
    const store = await Store.findOne({
      where: parsed,
      include: [Seller],
    })
    if (!store) {
      res
        .status(404)
        .json({ message: 'This store does not belong to a seller' })
      return
    }

    const seller = await findSellerById(store.seller_id)

    res.status(200).json(seller)
    return
  } catch (error) {
    return next(error)
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = searchSchema.parse(req.query)

    const sellers = await searchSeller(parsed)
    res.status(200).json(sellers)
    return
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

async function searchSeller({ searchTerm, limit, offset }: SearchType) {
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

    attributes: { exclude: ['createdAt', 'updatedAt', 'search_vector'] },
    raw: true,
  })

  const sellers = await Seller.findAll({
    where: { id: results.map((result) => result.id) },
    include: [
      { model: Boxe, attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Store, attributes: { exclude: ['createdAt', 'updatedAt'] } },
      {
        model: ProductCategory,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'search_vector'] },
  })

  return sellers
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSellerSchema.parse({
      ...req.body,
      phone_number: req.body.phone_number?.replace(/\D/g, '').trim(),
      name: req.body.name?.trim(),
    })
    const errors = await validateSellerCreate(parsed)
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
      for (const category of parsed.product_categories || []) {
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
      await t.rollback()
      return next(error)
    }
  } catch (error) {
    return next(error)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const seller = await findSellerByReqId(req, res)
    if (!seller) return

    const parsed = updateSellerSchema.parse({
      ...req.body,
      phone_number: req.body.phone_number?.replace(/\D/g, '').trim(),
      name: req.body.name?.trim(),
    })

    const errors = await validateSellerUpdate(seller?.id, parsed)
    if (errors.length > 0) {
      res.status(400).json({ errors })
      return
    }

    const t = await sequelize.transaction()
    try {
      await Seller.update(
        {
          name: parsed.name,
          phone_number: parsed.phone_number ? parsed.phone_number : null,
        },
        { where: { id: req.params.id }, transaction: t }
      )

      const { addedBoxes, removedBoxes } = await boxesChanges(
        seller.id,
        parsed.boxes
      )
      const { addedStores, removedStores } = await storesChanges(
        seller.id,
        parsed.stores
      )

      if (addedBoxes.length > 0) {
        const createdBoxes = await Boxe.bulkCreate(addedBoxes, {
          transaction: t,
        })
        await seller.$add('boxes', createdBoxes, { transaction: t })
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
        await seller.$add('stores', createdStores, { transaction: t })
      }
      if (removedStores.length > 0) {
        await Store.destroy({
          where: { id: removedStores.map((store) => store.id) },
          transaction: t,
        })
      }
      const newSellerProductCategories: ProductCategory[] = []
      for (const category of parsed.product_categories || []) {
        const foundCategory = await ProductCategory.findOne({
          where: { category },
        })
        if (foundCategory) newSellerProductCategories.push(foundCategory)
      }
      await seller.$add('product_categories', newSellerProductCategories, {
        transaction: t,
      })

      const removedCategories = seller.product_categories.filter(
        ({ category }) =>
          !newSellerProductCategories.some((c) => c.category === category)
      )
      if (removedCategories.length)
        await seller.$remove('product_categories', removedCategories, {
          transaction: t,
        })

      await t.commit()

      const updatedSeller = await findSellerById(req.params.id)
      if (!updatedSeller) return

      res.status(200).json(updatedSeller)
      return
    } catch (error) {
      await t.rollback()
      return next(error)
    }
  } catch (error) {
    return next(error)
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const seller = await findSellerByReqId(req, res)
    if (!seller) return

    await Seller.destroy({ where: { id: req.params.id } })
    res.status(204).send()
    return
  } catch (error) {
    return next(error)
  }
}

export async function favorite(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const seller = await findSellerByReqId(req, res)
    if (!seller) return
    const user = await findUserByReqId(req, res)
    if (!user) return

    await user.$add('favorite_sellers', seller)
    res.status(200).json({ message: 'Seller favorited' })
    return
  } catch (error) {
    return next(error)
  }
}
export async function unfavorite(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const seller = await findSellerByReqId(req, res)
    if (!seller) return
    const user = await findUserByReqId(req, res)
    if (!user) return

    await user.$remove('favorite_sellers', seller)
    res.status(200).json({ message: 'Seller unfavorited' })
    return
  } catch (error) {
    return next(error)
  }
}

export async function indexFavorites(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await findUserByReqId(req, res)
    if (!user) return

    const favoriteSellers = await user.$get('favorite_sellers', {
      include: [
        { model: Boxe, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        { model: Store, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        {
          model: ProductCategory,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'search_vector'] },
    })
    res.status(200).json(favoriteSellers)
    return
  } catch (error) {
    return next(error)
  }
}

export async function isFavorite(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const seller = await findSellerByReqId(req, res)
    if (!seller) return
    const user = await findUserByReqId(req, res)
    if (!user) return

    const isFavorite = await user.$has('favorite_sellers', seller)
    res.status(200).json({ isFavorite })
    return
  } catch (error) {
    return next(error)
  }
}

export async function putNote(req: Request, res: Response, next: NextFunction) {
  try {
    const seller = await findSellerByReqId(req, res)
    if (!seller) return
    const user = await findUserByReqId(req, res)
    if (!user) return

    const text = req.body.text
    if (text === undefined || text === null) {
      res.status(400).json({ message: 'text is required' })
      return
    }
    await user.$add('sellers_notes', seller, { through: { text } })
    const notes = await user.$get('notes', {
      where: { seller_id: seller.id },
    })
    res.status(200).json({ id: notes[0].id, text: notes[0].text })
    return
  } catch (error) {
    return next(error)
  }
}

export async function getNote(req: Request, res: Response, next: NextFunction) {
  try {
    const seller = await findSellerByReqId(req, res)
    if (!seller) return
    const user = await findUserByReqId(req, res)
    if (!user) return

    const notes = await user.$get('notes', {
      where: { seller_id: seller.id },
    })
    if (notes.length === 0) {
      res.status(404).json({ message: 'Note not found' })
      return
    }
    res.status(200).json({ id: notes[0].id, text: notes[0].text })
    return
  } catch (error) {
    return next(error)
  }
}
