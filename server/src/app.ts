import express from 'express'
import { type Request, type Response, Router } from 'express'
import z from 'zod'
import { validateData } from './middleware/validationMiddleware'

const bodySchema = z.object({
  name: z.string().nonempty().min(3).max(255),
})

const router = Router()
router.post('/', validateData(bodySchema), createName)

async function createName(req: Request, res: Response) {
  res.status(200).json({
    message: req.body.name,
  })
}

class App {
  app: express.Application

  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
  }
  routes() {
    this.app.use('/', router)
  }
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
  }
}

export default new App().app
