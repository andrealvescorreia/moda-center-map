import { Router } from 'express'
import { create, index } from '../controllers/seller'
import loginRequired from '../middleware/loginRequired'

const router = Router()
router.post('/', loginRequired, create)
router.get('/', index)
export default router
