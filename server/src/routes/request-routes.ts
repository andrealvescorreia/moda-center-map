import { type NextFunction, Router } from 'express'
import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { env, serverUrl } from '../env'

async function generateGoogleOAuthUrl(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.header('Access-Control-Allow-Origin', env.WEB_URL) //only allow requests from the web app
    res.header('Referrer-Policy', 'no-referrer-when-downgrade') // for http on development
    const redirectUrl = `${serverUrl}/oauth/google`

    const oAuth2Client = new OAuth2Client(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    )

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline', // for development. forces refresh token to be created
      scope: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      prompt: 'consent',
    })
    res.status(200).json({ url: authorizeUrl })
    return
  } catch (error) {
    next(error)
  }
}

const router = Router()
router.post('/google', generateGoogleOAuthUrl)

export default router
