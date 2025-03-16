import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import ms, { type StringValue } from 'ms'
import errorsIds from '../../../shared/operation-errors'
import User from '../database/models/user'
import { env } from '../env'
import { registerUser } from '../schemas/userSchema'
import { z, ZodError } from 'zod'

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    registerUser.parse(req.body)
    const existingUser = await User.findOne({
      where: {
        username: req.body.username,
      },
    })
    if (existingUser) {
      res.status(400).json({
        errors: [
          {
            field: 'username',
            code: errorsIds.USERNAME_ALREADY_TAKEN,
            message: 'Username already taken',
          },
        ],
      })
      return
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
    res.status(201).json({
      message: user.id,
    })
    return
  } catch (error) {
    if (error instanceof ZodError) {
      const errorsDetails = error.errors.map((e) => ({
        code: e.code === 'too_small'
          ? errorsIds.TOO_SHORT
          : e.code === 'too_big'
            ? errorsIds.TOO_BIG
            : errorsIds.INVALID,
        message: e.message,
        field: e.path[0],
      })).filter(e => e.code !== errorsIds.INVALID || e.field);

      if (errorsDetails.length > 0) {
        res.status(400).json({ errors: errorsDetails });
        return;
      }
    }
    next(error);
  }
}
