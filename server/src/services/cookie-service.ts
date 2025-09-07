import type { Response } from 'express'
import jwt from 'jsonwebtoken'
import ms, { type StringValue } from 'ms'
import { env } from '../env'

export const AUTH_COOKIE_NAME = 'authtoken'

export function setAuthCookie(res: Response, userId: string) {
  const token = jwt.sign({ id: userId }, env.TOKEN_SECRET, {
    expiresIn: ms(env.TOKEN_EXPIRATION as StringValue),
  })

  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true, // Ensure the cookie is sent only over HTTPS
    sameSite: 'none',
    maxAge: ms(env.TOKEN_EXPIRATION as StringValue),
    //partitioned: true, // Use partitioned cookies for better security
  })

  return res
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    //partitioned: true,
  })
}
