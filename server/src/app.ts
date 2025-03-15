import express from 'express'
import sequelizeErrorsMiddleware from './middleware/sequelizeErrorsMiddleware'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
const cookieParser = require('cookie-parser')

class App {
  app: express.Application

  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
  }
  routes() {
    this.app.use('/user', userRoutes)
    this.app.use('/auth', authRoutes)
  }
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use(sequelizeErrorsMiddleware)
    this.app.use(cookieParser())
  }
}

export default new App().app
