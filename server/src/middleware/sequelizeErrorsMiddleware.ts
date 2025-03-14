import type { NextFunction, Request, Response } from 'express'
import { DatabaseError, ValidationError } from 'sequelize'

const sequelizeErrorsMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    res.status(400).send({
      error: 'Validation Error',
      details: err.errors.map((e) => e.message),
    })
  }

  if (err instanceof DatabaseError) {
    res.status(500).send({
      error: 'Database Error',
      details: err.message,
    })
  }

  res.status(500).send({ errors: [{ message: 'Something went wrong' }] })
  //next(err)
}

export default sequelizeErrorsMiddleware
