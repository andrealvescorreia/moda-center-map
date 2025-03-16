import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import ms, { type StringValue } from 'ms'
import { ZodError } from 'zod'
import errorsIds from '../../../shared/operation-errors'
import User from '../database/models/user'
import { env } from '../env'
import { registerUser } from '../schemas/userSchema'

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, password } = registerUser.parse(req.body)
    const existingUser = await User.findOne({
      where: {
        username
      },
    })
    if (existingUser) {
      res.status(400).json({
        errors: [
          {
            field: 'username',
            code: errorsIds.ALREADY_IN_USE,
            message: 'Username already taken',
          },
        ],
      })
      return
    }

    const user = await User.create({
      username,
      password,
    })

    const { id } = user
    const token = jwt.sign({ id, username }, env.TOKEN_SECRET, {
      expiresIn: ms(env.TOKEN_EXPIRATION as StringValue),
    })
    res.cookie('authtoken', token, {
      httpOnly: true,
      maxAge: ms(env.TOKEN_EXPIRATION as StringValue),
    })
    res.status(201).json({
      id: user.id,
      username: user.username,
    })
    return
  } catch (error) {
    if (error instanceof ZodError) {
      const errorsDetails = error.errors.map((e) => ({
        code:
          e.code === 'too_small'
            ? errorsIds.TOO_SHORT
            : e.code === 'too_big'
              ? errorsIds.TOO_BIG
              : errorsIds.INVALID,
        message: e.message,
        field: e.path[0],
      }))

      res.status(400).json({ errors: errorsDetails })
      return
    }
    next(error)
  }
}
