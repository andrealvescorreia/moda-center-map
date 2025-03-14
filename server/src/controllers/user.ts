import type { NextFunction, Request, Response } from 'express'
import User from '../database/models/user'

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const existingUser = await User.findOne({
      where: {
        username: req.body.username,
      },
    })
    if (existingUser) {
      res.status(400).json({
        message: 'Username already taken',
      })
    }

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
    })
    res.status(200).json({
      message: user.id,
    })
  } catch (error) {
    next(error)
  }
}
