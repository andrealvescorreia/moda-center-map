import { Router } from 'express'
import {
  create,
  destroy,
  index,
  search,
  show,
  showByBoxe,
  showByStore,
} from '../controllers/seller'
import loginRequired from '../middleware/loginRequired'

const router = Router()
router.post('/', loginRequired, create)
router.get('/', index)
router.get('/id/:id', show)
router.delete('/id/:id', loginRequired, destroy)
router.get('/search', search)
router.get('/boxe', showByBoxe)
router.get('/store', showByStore)
export default router
