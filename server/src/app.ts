import cookieParser from 'cookie-parser'
import express from 'express'
import errorHandler from './middleware/errorHandler'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

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
  }
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use(cookieParser())
  }
}

export default new App().app
