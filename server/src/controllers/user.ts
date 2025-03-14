import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import ms, { type StringValue } from 'ms'
import User from '../database/models/user'
import { env } from '../env'

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

    const { id, username } = user
    const token = jwt.sign({ id, username }, env.TOKEN_SECRET, {
      expiresIn: ms(env.TOKEN_EXPIRATION as StringValue),
    })
    res.cookie('authtoken', token, {
      httpOnly: true,
      maxAge: ms(env.TOKEN_EXPIRATION as StringValue),
    })
    res.status(200).json({
      message: user.id,
    })
  } catch (error) {
    next(error)
  }
}
