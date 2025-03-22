import type { NextFunction, Request, Response } from 'express'
import z from 'zod'
import Boxe from '../database/models/boxe'
import Seller from '../database/models/seller'
import Store from '../database/models/store'

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    if (!z.string().uuid().safeParse(req.params.id).success) {
      res.status(400).json({ message: 'Invalid id' })
      return
    }

    async function getSeller(seller_id: string) {
      return Seller.findOne({
        where: { id: seller_id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'search_vector'] },
      })
    }

    const boxe = await Boxe.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })
    if (boxe) {
      const seller = await getSeller(boxe.seller_id)
      res.status(200).json({ boxe, seller })
      return
    }

    const store = await Store.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })
    if (store) {
      const seller = await getSeller(store.seller_id)
      res.status(200).json({ store, seller })
      return
    }

    res.status(404).json({ message: 'Selling location not found' })
    return
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
