// Helper functions to determine the differences between a seller's provided selling locations and those stored in the database.

import Boxe from '../database/models/boxe'
import Store from '../database/models/store'
import type { BoxeType } from '../schemas/boxeSchema'
import type { StoreType } from '../schemas/storeSchema'

export async function boxesChanges(
  sellerId: string,
  updatedBoxes: BoxeType[] | undefined
) {
  if (!updatedBoxes) return { addedBoxes: [], removedBoxes: [] }

  const existingBoxes = await Boxe.findAll({
    where: { seller_id: sellerId },
  })

  const addedBoxes = updatedBoxes.filter(
    (box) =>
      !existingBoxes.some(
        (existingBox) =>
          existingBox.sector_color === box.sector_color &&
          existingBox.street_letter === box.street_letter &&
          existingBox.box_number === box.box_number
      )
  )

  const removedBoxes = existingBoxes.filter(
    (existingBox) =>
      !updatedBoxes.some(
        (box) =>
          box.sector_color === existingBox.sector_color &&
          box.street_letter === existingBox.street_letter &&
          box.box_number === existingBox.box_number
      )
  )

  return {
    addedBoxes,
    removedBoxes,
  }
}

export async function storesChanges(
  sellerId: string,
  updatedStores: StoreType[] | undefined
) {
  if (!updatedStores) return { addedStores: [], removedStores: [] }

  const existingStores = await Store.findAll({
    where: { seller_id: sellerId },
  })

  const addedStores = updatedStores.filter(
    (box) =>
      !existingStores.some(
        (existingBox) =>
          existingBox.sector_color === box.sector_color &&
          existingBox.block_number === box.block_number &&
          existingBox.store_number === box.store_number
      )
  )

  const removedStores = existingStores.filter(
    (existingBox) =>
      !updatedStores.some(
        (box) =>
          box.sector_color === existingBox.sector_color &&
          box.block_number === existingBox.block_number &&
          box.store_number === existingBox.store_number
      )
  )

  return {
    addedStores,
    removedStores,
  }
}
