import { Router } from 'express'
import { show } from '../controllers/selling-location'

const router = Router()
router.get('/id/:id', show)

export default router
