import type { NextFunction, Request, Response } from 'express'
import { DatabaseError, ValidationError } from 'sequelize'
import { ZodError, type z } from 'zod'

const sequelizeErrorsMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const errorMessages = err.errors.map((issue: z.ZodIssue) => ({
      message: `${issue.path.join('.')}: ${issue.message}`,
    }))
    res.status(400).json({ error: 'Invalid data', details: errorMessages })
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
