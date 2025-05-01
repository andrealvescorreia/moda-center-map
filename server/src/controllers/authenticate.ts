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
      secure: true, // Ensure the cookie is sent only over HTTPS
      sameSite: 'none',
      maxAge: ms(env.TOKEN_EXPIRATION as StringValue),
      partitioned: true, // Use partitioned cookies for better security
    })
    res.status(200).json({ id, username })
    return
  } catch (error) {
    next(error)
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.clearCookie('authtoken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true,
    })
    res.status(200).json('logged out!')
    return
  } catch (error) {
    next(error)
  }
}
