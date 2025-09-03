import type { Model, ModelStatic } from 'sequelize'
import z from 'zod'
import errorsIds from '../../../shared/operation-errors'
import type { ValidationError } from '../schemas/validationErrorType'

/**
 * Validates the format of the provided entity ID and checks if the entity exists in the database.
 *
 * @param id - The entity ID to validate.
 * @param EntityModel - The Sequelize model to query for the entity.
 * @returns An array of validation errors if the ID format is invalid or the entity does not exist; otherwise, an empty array.
 *
 * @remarks
 * - Checks if the ID is a valid UUID string.
 * - Checks if an entity with the given ID exists in the database.
 */
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
