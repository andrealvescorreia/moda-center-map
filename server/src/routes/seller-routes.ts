import { Router } from 'express'
import {
  create,
  index,
  search,
  showByBoxe,
  showByStore,
} from '../controllers/seller'
import loginRequired from '../middleware/loginRequired'

const router = Router()
router.post('/', loginRequired, create)
router.get('/', index)
router.get('/search', search)
router.get('/boxe', showByBoxe)
router.get('/store', showByStore)
export default router
