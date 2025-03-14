import { Router } from 'express'
import { createUser } from '../controllers/user'
import { validateData } from '../middleware/validationMiddleware'
import userSchema from '../schemas/userSchema'

const router = Router()
router.post('/', validateData(userSchema), createUser)

export default router
