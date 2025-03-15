import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import ms, { type StringValue } from 'ms'
import User from '../database/models/user'
import { env } from '../env'

//login
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username = '', password = '' } = req.body //TODO: use zod parser

    if (!username || !password) {
      res.status(401).json({
        errors: ['Credenciais inválidas'],
      })
      return
    }

    const user = await User.findOne({ where: { username } })

    if (!user || user === null) {
      res.status(401).json({
        errors: ['Usuario não existe'],
      })
      return
    }

    if ((await user.passwordIsCorrect(password)) === false) {
      res.status(401).json({
        errors: ['Senha inválida'],
      })
      return
    }

    const { id } = user
    const token = jwt.sign({ id, username }, env.TOKEN_SECRET, {
      expiresIn: ms(env.TOKEN_EXPIRATION as StringValue),
    })
    res.cookie('authtoken', token, {
      httpOnly: true,
      maxAge: ms(env.TOKEN_EXPIRATION as StringValue),
    })
    res.send('authenticated!')
    return
  } catch (error) {
    next(error)
  }
}
