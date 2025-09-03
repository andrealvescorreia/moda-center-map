import type { NextFunction, Request, Response } from 'express'
import GoogleUser from '../database/models/google-user'
import LocalUser from '../database/models/local-user'
import User from '../database/models/user'
import { localUserRegister } from '../schemas/userSchema'
import { setAuthCookie } from '../services/cookie-service'
import { UserService } from '../services/user-service'

const userService = new UserService()

export async function showUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.body.userId
    const user = await User.findOne({ where: { id: userId } })
    if (user?.type === 'local') {
      const localUser = await LocalUser.findOne({ where: { id: userId } })
      res.status(200).json({
        id: userId,
        type: 'local',
        username: localUser?.username,
      })
      return
    }

    const googleUser = await GoogleUser.findOne({ where: { id: userId } })
    res.status(200).json({
      id: userId,
      type: 'google',
      name: googleUser?.name,
      sub: googleUser?.sub,
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

    setAuthCookie(res, id)
    res.status(201).json({
      id,
      username,
    })
    return
  } catch (error) {
    next(error)
  }
}
