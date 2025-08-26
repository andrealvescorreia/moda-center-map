import type { Model, ModelStatic } from 'sequelize'
import z from 'zod'
import errorsIds from '../../../shared/operation-errors'
import type { ValidationError } from '../schemas/validationErrorType'

export async function validateEntityId(
  id: string,
  EntityModel: ModelStatic<Model>
) {
  const entityName = EntityModel.name
  const errors: ValidationError[] = []
  if (!z.string().uuid().safeParse(id).success) {
    errors.push({
      code: errorsIds.INVALID,
      field: 'id',
      message: `invalid ${entityName.toLowerCase()} ID format`,
    })
    return errors
  }
  const foundEntity = await EntityModel.findByPk(id)
  if (!foundEntity) {
    errors.push({
      code: errorsIds.NOT_FOUND,
      field: 'id',
      message: `${entityName} not found`,
    })
  }
  return errors
}
