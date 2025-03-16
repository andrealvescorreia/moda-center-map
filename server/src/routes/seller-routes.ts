import { Router } from 'express'
import { createSeller } from '../controllers/seller'
import loginRequired from '../middleware/loginRequired'

const router = Router()
router.post('/', loginRequired, createSeller)

export default router
