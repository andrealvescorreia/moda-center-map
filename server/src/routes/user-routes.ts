import { Router } from 'express'
import { createUser, showUser } from '../controllers/user'
import loginRequired from '../middleware/loginRequired'

const router = Router()
router.post('/', createUser)
router.get('/', loginRequired, showUser)

export default router
