import { Router } from 'express'
import { create, index, showByBoxe, showByStore } from '../controllers/seller'
import loginRequired from '../middleware/loginRequired'

const router = Router()
router.post('/', loginRequired, create)
router.get('/', index)
router.get('/boxe', showByBoxe)
router.get('/store', showByStore)
export default router
