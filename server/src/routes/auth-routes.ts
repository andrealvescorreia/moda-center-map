import { Router } from 'express'
import { authenticate, logout } from '../controllers/authenticate'

const router = Router()
router.post('/', authenticate)
router.post('/logout', logout)

export default router
