import cookieParser from 'cookie-parser'
import express from 'express'
import errorHandler from './middleware/errorHandler'
import authRoutes from './routes/auth-routes'
import sellerRoutes from './routes/seller-routes'
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
    this.app.use('/seller', sellerRoutes)
  }
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use(cookieParser())
  }
}

export default new App().app
