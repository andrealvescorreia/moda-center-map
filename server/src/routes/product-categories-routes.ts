import { Router } from 'express'
import { index } from '../controllers/product-categories'

const router = Router()
router.get('/', index)
export default router
