import type { NextFunction, Request, Response } from 'express'
import LocalUser from '../database/models/local-user'
import { clearAuthCookie, setAuthCookie } from '../services/cookie-service'

//login (local user)
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

    const user = await LocalUser.findOne({ where: { username } })

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
    setAuthCookie(res, id)
    res.status(200).json({ id, username, type: 'local' })
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
    clearAuthCookie(res)
    res.status(200).json('logged out!')
    return
  } catch (error) {
    next(error)
  }
}
