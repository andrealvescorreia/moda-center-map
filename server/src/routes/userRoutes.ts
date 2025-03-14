import { Router } from 'express'
import { createUser } from '../controllers/user'
import { validateData } from '../middleware/validationMiddleware'
import { registerUser } from '../schemas/userSchema'

const router = Router()
router.post('/', validateData(registerUser), createUser)

export default router
