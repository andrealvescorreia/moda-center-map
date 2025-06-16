import { Router } from 'express'
import {
  create,
  destroy,
  favorite,
  index,
  indexFavorites,
  isFavorite,
  search,
  show,
  showByBoxe,
  showByStore,
  unfavorite,
  update,
} from '../controllers/seller'
import loginRequired from '../middleware/loginRequired'

const router = Router()
router.post('/', loginRequired, create)
router.put('/id/:id', loginRequired, update)
router.get('/', index)
router.get('/id/:id', show)
router.delete('/id/:id', loginRequired, destroy)
router.post('/favorite/:id', loginRequired, favorite)
router.get('/favorite/:id', loginRequired, isFavorite)
router.delete('/favorite/:id', loginRequired, unfavorite)
router.get('/favorite/', loginRequired, indexFavorites)
router.get('/search', search)
router.get('/boxe', showByBoxe)
router.get('/store', showByStore)
export default router
