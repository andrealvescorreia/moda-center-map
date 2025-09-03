import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import ms, { type StringValue } from 'ms'
import { env } from '../env'
import { localUserRegister } from '../schemas/userSchema'
import { UserService } from '../services/user-service'

const userService = new UserService()

export async function showUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.status(200).json({
      userId: req.body.userId,
      username: req.body.username,
    })
    return
  } catch (error) {
    return next(error)
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = localUserRegister.parse(req.body)
    const result = await userService.create(parsed)
    if (!result.success || !result.data) {
      res.status(400).json({
        errors: result.errors,
      })
      return
    }
    const { id, username } = result.data

    const token = jwt.sign({ id, username }, env.TOKEN_SECRET, {
      expiresIn: ms(env.TOKEN_EXPIRATION as StringValue),
    })
    res.cookie('authtoken', token, {
      httpOnly: true,
      maxAge: ms(env.TOKEN_EXPIRATION as StringValue),
    })
    res.status(201).json({
      id,
      username,
    })
    return
  } catch (error) {
    next(error)
  }
}
