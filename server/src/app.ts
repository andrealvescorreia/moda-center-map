import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { env, serverUrl } from './env'
import errorHandler from './middleware/errorHandler'
import authRoutes from './routes/auth-routes'
import oAuthRoutes from './routes/oauth-routes'
import pCategoriesRoutes from './routes/product-categories-routes'
import requestRoutes from './routes/request-routes'
import sellerRoutes from './routes/seller-routes'
import sellingLocationRoutes from './routes/selling-location-routes'
import userRoutes from './routes/user-routes'
class App {
  app: express.Application

  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
    this.app.use(errorHandler) //o unico middleware que deve vir depois das rotas
  }
  routes() {
    this.app.use('/user', userRoutes)
    this.app.use('/auth', authRoutes)
    this.app.use('/oauth', oAuthRoutes)
    this.app.use('/request-oauth', requestRoutes)
    this.app.use('/seller', sellerRoutes)
    this.app.use('/product-categories', pCategoriesRoutes)
    this.app.use('/selling-locations', sellingLocationRoutes)
  }
  middlewares() {
    const allowedOrigins = [
      env.WEB_URL,
      serverUrl, // swagger-ui development "Try it out"
      'http://localhost:5173', // vite development server
      'http://localhost:4173', // vite preview server
    ]
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin)
          } else {
            callback(new Error('Not allowed by CORS'))
          }
        },
        credentials: true,
      })
    )
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use(cookieParser())
  }
}

export default new App().app
