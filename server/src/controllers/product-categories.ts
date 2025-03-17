import type { NextFunction, Request, Response } from 'express'
import ProductCategory from '../database/models/product-category'

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const sellers = await ProductCategory.findAll({})
    res.status(200).json(sellers)
    return
  } catch (error) {
    return next(error)
  }
}
