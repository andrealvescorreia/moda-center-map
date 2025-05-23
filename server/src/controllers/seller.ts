import type { NextFunction, Request, Response } from 'express'
import { Sequelize } from 'sequelize'
import z from 'zod'
import sequelize from '../database'
import Boxe from '../database/models/boxe'
import ProductCategory from '../database/models/product-category'
import Seller from '../database/models/seller'
import Store from '../database/models/store'
import User from '../database/models/user'
import { registerSellerSchema } from '../schemas/sellerSchema'
import { validateNewSeller } from '../services/seller-validation'

export async function index(req: Request, res: Response, next: NextFunction) {
  const optionalParams = z.object({
    order_by: z.string().optional(),
    order: z.enum(['ASC', 'DESC', 'asc', 'desc']).optional(),
  })
  try {
    const parsed = optionalParams.parse(req.query)
    const sellers = await Seller.findAll({
      order: [
        [
          parsed.order_by ? parsed.order_by : 'createdAt',
          parsed.order ? parsed.order : 'DESC',
        ],
      ],
      include: [
        { model: Boxe, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        { model: Store, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        {
          model: ProductCategory,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
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

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    if (!z.string().uuid().safeParse(req.params.id).success) {
      res.status(400).json({ message: 'Invalid id' })
      return
    }

    const seller = await Seller.findOne({
      where: { id: req.params.id },
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
    if (!seller) {
      res.status(404).json({ message: 'Seller not found' })
      return
    }
    res.status(200).json(seller)
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

const boxeSchema = z.object({
  sector_color: z.string(),
  street_letter: z.string(),
  box_number: z.coerce.number(),
})

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

    const seller = await Seller.findOne({
      where: { id: boxe.seller_id },
      include: [
        { model: Boxe, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        { model: Store, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        {
          model: ProductCategory,
          attributes: { exclude: ['createdAt', 'updatedAt', 'search_vector'] },
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })

    res.status(200).json(seller)
    return
  } catch (error) {
    return next(error)
  }
}

const storeSchema = z.object({
  sector_color: z.string(),
  block_number: z.coerce.number(),
  store_number: z.coerce.number(),
})
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

    const seller = await Seller.findOne({
      where: { id: store.seller_id },
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

    res.status(200).json(seller)
    return
  } catch (error) {
    return next(error)
  }
}

const searchSchema = z.object({
  searchTerm: z.string(),
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
})

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

type Search = z.infer<typeof searchSchema>
async function searchSeller({ searchTerm, limit, offset }: Search) {
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
      await t.rollback()
      return next(error)
    }
  } catch (error) {
    return next(error)
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    if (!z.string().uuid().safeParse(req.params.id).success) {
      res.status(400).json({ message: 'Invalid id' })
      return
    }
    const seller = await Seller.findOne({ where: { id: req.params.id } })
    if (!seller) {
      res.status(404).json({ message: 'Seller not found' })
      return
    }
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
    if (!z.string().uuid().safeParse(req.params.id).success) {
      res.status(400).json({ message: 'Invalid id' })
      return
    }

    const seller = await Seller.findOne({ where: { id: req.params.id } })
    if (!seller) {
      res.status(404).json({ message: 'Seller not found' })
      return
    }

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
    if (!z.string().uuid().safeParse(req.params.id).success) {
      res.status(400).json({ message: 'Invalid id' })
      return
    }

    const seller = await Seller.findOne({ where: { id: req.params.id } })
    if (!seller) {
      res.status(404).json({ message: 'Seller not found' })
      return
    }

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
    if (!z.string().uuid().safeParse(req.params.id).success) {
      res.status(400).json({ message: 'Invalid id' })
      return
    }

    const seller = await Seller.findOne({ where: { id: req.params.id } })
    if (!seller) {
      res.status(404).json({ message: 'Seller not found' })
      return
    }

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

    const isFavorite = await user.$has('favorite_sellers', seller)
    res.status(200).json({ isFavorite })
    return
  } catch (error) {
    return next(error)
  }
}
