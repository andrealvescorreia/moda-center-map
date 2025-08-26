import errorsIds from '../../../shared/operation-errors'
import type { ValidationError } from '../schemas/validationErrorType'

export function validationErrorsToHttpCode(errors: ValidationError[]) {
  if (errors.some((err) => err.code === errorsIds.NOT_FOUND)) return 404
  return 400
}
