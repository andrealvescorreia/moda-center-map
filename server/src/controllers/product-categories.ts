import type { NextFunction, Request, Response } from 'express'
import ProductCategory from '../database/models/product-category'

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const productCategories = await ProductCategory.findAll({})
    res.status(200).json(productCategories)
    return
  } catch (error) {
    return next(error)
  }
}
