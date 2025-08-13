import errorsIds from '../../../shared/operation-errors'
import User from '../database/models/user'
import type { UserRegisterType } from '../schemas/userSchema'
import type { ValidationError } from '../schemas/validationErrorType'

async function usernameTaken(username: string) {
  const existingUser = await User.findOne({
    where: { username },
  })
  return !!existingUser
}

export async function validateUserCreate(user: UserRegisterType) {
  let errors: ValidationError[] = []
  if (await usernameTaken(user.username)) {
    errors = [
      {
        field: 'username',
        code: errorsIds.ALREADY_IN_USE,
        message: 'Username already taken',
      },
    ]
  }
  return errors
}
