import type { NextFunction, Request, Response } from 'express'
import { boxeSchema } from '../schemas/boxeSchema'
import { queryOptionsSchema } from '../schemas/queryOptionsSchema'
import { searchSchema } from '../schemas/searchSchema'
import { createSellerSchema, updateSellerSchema } from '../schemas/sellerSchema'
import { storeSchema } from '../schemas/storeSchema'
import { SellerService } from '../services/seller-service'
import { UserService } from '../services/user-service'
import { validationErrorsToHttpCode } from '../services/validation-errors-to-http-code'

const sellerService = new SellerService()
const userService = new UserService()

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = queryOptionsSchema.parse(req.query)
    const sellers = await sellerService.findAll(parsed)
    res.status(200).json(sellers)
    return
  } catch (error) {
    return next(error)
  }
}

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerResult = await sellerService.findOne(req.params.id)
    if (sellerResult.errors.length > 0 || !sellerResult.data) {
      const statusCode = validationErrorsToHttpCode(sellerResult.errors)
      res.status(statusCode).json({ errors: sellerResult.errors })
      return
    }
    res.status(200).json(sellerResult.data)
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
    const seller = await sellerService.findOneByBoxe(parsed)
    if (!seller) {
      res.status(404).json({ message: 'This boxe does not belong to a seller' })
      return
    }

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
    const seller = await sellerService.findOneByStore(parsed)
    if (!seller) {
      res
        .status(404)
        .json({ message: 'This store does not belong to a seller' })
      return
    }

    res.status(200).json(seller)
    return
  } catch (error) {
    return next(error)
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = searchSchema.parse(req.query)
    const sellers = await sellerService.search(parsed)
    res.status(200).json(sellers)
    return
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createSellerSchema.parse({
      ...req.body,
      phone_number: req.body.phone_number?.replace(/\D/g, '').trim(),
      name: req.body.name?.trim(),
    })
    const newSeller = await sellerService.create(parsed)
    if (newSeller !== null && 'errors' in newSeller) {
      res.status(400).json({ errors: newSeller.errors })
      return
    }
    res.status(201).json(newSeller)
    return
  } catch (error) {
    return next(error)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateSellerSchema.parse({
      ...req.body,
      phone_number: req.body.phone_number?.replace(/\D/g, '').trim(),
      name: req.body.name?.trim(),
    })
    const updatedSeller = await sellerService.update(parsed, req.params.id)
    if (updatedSeller && 'errors' in updatedSeller) {
      const statusCode = validationErrorsToHttpCode(updatedSeller.errors)
      res.status(statusCode).json({ errors: updatedSeller.errors })
      return
    }
    res.status(200).json(updatedSeller)
    return
  } catch (error) {
    return next(error)
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const deletion = await sellerService.delete(req.params.id)
    if (typeof deletion === 'object' && 'errors' in deletion) {
      const statusCode = validationErrorsToHttpCode(deletion.errors)
      res.status(statusCode).json({ errors: deletion.errors })
      return
    }
    res.status(200).json({ message: 'Seller deleted' })
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
    const result = await userService.addFavoriteSeller(
      req.body.userId,
      req.params.id
    )
    if (!result.success) {
      const statusCode = validationErrorsToHttpCode(result.errors)
      res.status(statusCode).json({ errors: result.errors })
      return
    }
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
    const result = await userService.removeFavoriteSeller(
      req.body.userId,
      req.params.id
    )
    if (!result.success) {
      const statusCode = validationErrorsToHttpCode(result.errors)
      res.status(statusCode).json({ errors: result.errors })
      return
    }
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
    const result = await userService.findAllFavoriteSellers(req.body.userId)
    if (!result.success) {
      const statusCode = validationErrorsToHttpCode(result.errors)
      res.status(statusCode).json({ errors: result.errors })
      return
    }
    res.status(200).json(result.data)
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
    const result = await userService.sellerIsFavorite(
      req.body.userId,
      req.params.id
    )
    if (!result.success) {
      const statusCode = validationErrorsToHttpCode(result.errors)
      res.status(statusCode).json({ errors: result.errors })
      return
    }

    res.status(200).json({ isFavorite: result.isFavorite })
    return
  } catch (error) {
    return next(error)
  }
}

export async function putNote(req: Request, res: Response, next: NextFunction) {
  try {
    const text = req.body.text
    if (text === undefined || text === null) {
      res.status(400).json({ message: 'text is required' })
      return
    }
    const result = await userService.putNoteOnSeller(
      req.body.userId,
      req.params.id,
      text
    )
    if (!result.success) {
      const statusCode = validationErrorsToHttpCode(result.errors)
      res.status(statusCode).json({ errors: result.errors })
      return
    }
    res.status(200).json(result.data)
    return
  } catch (error) {
    return next(error)
  }
}

export async function getNote(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.findOneNote(req.body.userId, req.params.id)
    if (!result.success) {
      const statusCode = validationErrorsToHttpCode(result.errors)
      res.status(statusCode).json({ errors: result.errors })
      return
    }
    if (!result.data) {
      res.status(404).json({ message: 'Note not found' })
      return
    }
    res.status(200).json(result.data)
    return
  } catch (error) {
    return next(error)
  }
}
