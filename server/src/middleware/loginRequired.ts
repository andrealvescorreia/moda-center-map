import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import LocalUser from '../database/models/local-user'
import { env } from '../env'

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.authtoken
  if (!token) {
    res.status(401).json({
      errors: [{ message: 'Login required' }],
    })
    return
  }

  try {
    const dados = jwt.verify(token, env.TOKEN_SECRET)
    if (typeof dados !== 'object' || dados === null) {
      res.status(401).json({
        errors: [{ message: 'Invalid token' }],
      })
      return
    }
    const { id, username } = dados

    //TODO: also account for google users!
    const user = await LocalUser.findOne({
      where: {
        id,
        username,
      },
    })

    if (!user) {
      // acontece quando o usuário troca o seu username,
      // mas continua com o jwt antigo de antes da troca.
      // neste caso, o usuário precisa fazer login de novo
      // com o seu novo username para receber o novo token, assim terá acesso ao sistema.
      res.status(401).json({
        errors: [{ message: 'Invalid user' }],
      })
      return
    }

    req.body.userId = id
    req.body.username = username
    return next()
  } catch (e) {
    res.status(401).json({
      errors: [{ message: 'Token expired or invalid' }],
    })
    return
  }
}
