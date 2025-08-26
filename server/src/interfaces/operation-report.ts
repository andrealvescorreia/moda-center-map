import type { ValidationError } from '../schemas/validationErrorType'

export interface OperationReport {
  success: boolean
  errors: ValidationError[]
}
