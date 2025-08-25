import errorsIds from '../../../shared/operation-errors'
import type { StoreType } from '../schemas/storeSchema'

export function validateStore(store: StoreType) {
  const errors = []
  if (
    ['blue', 'orange', 'red', 'green'].includes(store.sector_color) &&
    store.block_number < 8 &&
    store.store_number > 15
  ) {
    errors.push({
      code: errorsIds.TOO_BIG,
      field: 'store_number',
      message:
        'Number must be less than or equal to 15 for blocks between 1 and 7 of this sector',
    })
  }
  if (
    ['blue', 'orange'].includes(store.sector_color) &&
    store.block_number === 8 &&
    store.store_number > 14
  ) {
    errors.push({
      code: errorsIds.TOO_BIG,
      field: 'store_number',
      message:
        'Number must be less than or equal to 14 for block 8 of this sector',
    })
  }
  if (
    ['red', 'green'].includes(store.sector_color) &&
    store.block_number === 8 &&
    store.store_number > 6
  ) {
    errors.push({
      code: errorsIds.TOO_BIG,
      field: 'store_number',
      message:
        'Number must be less than or equal to 6 for block 8 of this sector',
    })
  }
  if (
    ['yellow', 'white'].includes(store.sector_color) &&
    store.block_number <= 4 &&
    store.store_number > 18
  ) {
    errors.push({
      code: errorsIds.TOO_BIG,
      field: 'store_number',
      message:
        'Number must be less than or equal to 18 for blocks between 1 and 4 of this sector',
    })
  }
  return errors
}
