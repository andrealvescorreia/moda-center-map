import { type NextFunction, Router } from 'express'
import type { Request, Response } from 'express'
import { OAuth2Client, type OAuth2ClientOptions } from 'google-auth-library'
import GoogleUser from '../database/models/google-user'
import User from '../database/models/user'
import { env, serverUrl } from '../env'
import { setAuthCookie } from '../services/cookie-service'

async function googleUserAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const code = req.query.code
    if (!code || typeof code !== 'string') {
      res.status(403).json({ error: 'Invalid code' })
      return
    }
    const redirectUrl = `${serverUrl}/oauth/google`

    const options: OAuth2ClientOptions = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: redirectUrl,
    }
    const oAuth2Client = new OAuth2Client(options)
    const response = await oAuth2Client.getToken(code)
    await oAuth2Client.setCredentials(response.tokens)

    const user = oAuth2Client.credentials
    if (!user || typeof user.access_token !== 'string' || !user.id_token) {
      res.status(403).json({ error: 'Invalid credentials' })
      return
    }
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: user.id_token,
      audience: env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      res.status(403).json({ error: 'Could not retrieve user information' })
      return
    }
    const { sub, name } = payload

    let id = ''
    const existingUser = await GoogleUser.findOne({ where: { sub } })

    if (existingUser) {
      id = existingUser.id
    } else {
      const createdUser = await User.create({ type: 'google' })
      id = createdUser.id
      await GoogleUser.create({
        id,
        name,
        sub,
      })
    }

    setAuthCookie(res, id)
    res.redirect(303, `${env.WEB_URL}/user`)
    return
  } catch (error) {
    console.log('Error with signing in with google: ', error)
    next(error)
  }
}

const router = Router()
router.get('/google', googleUserAuth)

export default router
