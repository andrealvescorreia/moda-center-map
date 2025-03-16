import type { NextFunction, Request, Response } from 'express'
import { DatabaseError, ValidationError } from 'sequelize'
import { ZodError, type z } from 'zod'
import errorsIds from '../../../shared/operation-errors'

const sequelizeErrorsMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const errorsDetails = err.errors.map((e) => ({
      code:
        e.code === 'too_small'
          ? errorsIds.TOO_SHORT
          : e.code === 'too_big'
            ? errorsIds.TOO_BIG
            : errorsIds.INVALID,
      message: e.message,
      field: e.path.join('.'),
    }))

    res.status(400).json({ errors: errorsDetails })
    return
  }
  if (err instanceof ValidationError) {
    res.status(400).send({
      error: 'Validation Error',
      details: err.errors.map((e) => e.message),
    })
    return
  }

  if (err instanceof DatabaseError) {
    res.status(500).send({
      error: 'Database Error',
      details: err.message,
    })
    return
  }

  res.status(500).send({ errors: [{ message: 'Something went wrong' }] })
  next(err)
}

export default sequelizeErrorsMiddleware
