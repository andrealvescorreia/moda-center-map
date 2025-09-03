import errorsIds from '../../../shared/operation-errors'
import LocalUser from '../database/models/local-user'
import type { LocalUserRegisterType } from '../schemas/userSchema'
import type { ValidationError } from '../schemas/validationErrorType'

async function usernameTaken(username: string) {
  const existingUser = await LocalUser.findOne({
    where: { username },
  })
  return !!existingUser
}

export async function validateLocalUserCreate(user: LocalUserRegisterType) {
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
