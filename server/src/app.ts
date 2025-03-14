import express from 'express'
import { type Request, type Response, Router } from 'express'
import z from 'zod'
import { validateData } from './middleware/validationMiddleware'
import './database/index' //executes the database connection
import sequelizeErrorsMiddleware from './middleware/sequelizeErrorsMiddleware'
import userRouter from './routes/userRouter'

class App {
  app: express.Application

  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
  }
  routes() {
    this.app.use('/user', userRouter)
  }
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use(sequelizeErrorsMiddleware)
  }
}

export default new App().app
