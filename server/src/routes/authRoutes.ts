import { Router } from 'express'
import { authenticate } from '../controllers/authenticate'

const router = Router()
router.post('/', authenticate)

export default router
