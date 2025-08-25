import errorsIds from '../../../shared/operation-errors'
import type { BoxeType } from '../schemas/boxeSchema'

export function validateBoxe(
  box: BoxeType
): { code: string; field?: string; message: string }[] {
  const errors = []
  const box_number_tooBig =
    ['blue', 'orange', 'red', 'green'].includes(box.sector_color) &&
    box.box_number > 120

  if (box_number_tooBig) {
    errors.push({
      code: errorsIds.TOO_BIG,
      field: 'box_number',
      message:
        'Box number must be less than 121 for blue, orange, red, and green sectors',
    })
  }

  const letterAorPerror = validateBoxLetterAorP(box)
  if (letterAorPerror) errors.push(letterAorPerror)

  if (boxOverlapsWithFoodCourt(box)) {
    errors.push({
      code: errorsIds.INVALID,
      message:
        'This box cannot exist inside Moda Center, otherwise it would overlap with food court',
    })
  }
  if (boxOverlapsWithStores(box)) {
    errors.push({
      code: errorsIds.INVALID,
      message:
        'This box cannot exist inside Moda Center, otherwise it would overlap with stores',
    })
  }
  return errors
}

function validateBoxLetterAorP(box: {
  sector_color: string
  box_number: number
  street_letter: string
}) {
  if (['A', 'P'].includes(box.street_letter)) {
    const isEven = box.box_number % 2 === 0
    const evenSectors =
      box.street_letter === 'A'
        ? ['blue', 'green', 'yellow']
        : ['orange', 'red', 'white']
    const oddSectors =
      box.street_letter === 'A'
        ? ['orange', 'red', 'white']
        : ['blue', 'green', 'yellow']

    if (evenSectors.includes(box.sector_color) && !isEven) {
      return {
        code: errorsIds.INVALID,
        field: 'box_number',
        message: `Street letter ${box.street_letter} of sector ${box.sector_color} must have even box number`,
      }
    }

    if (oddSectors.includes(box.sector_color) && isEven) {
      return {
        code: errorsIds.INVALID,
        field: 'box_number',
        message: `Street letter ${box.street_letter} of sector ${box.sector_color} must have odd box number`,
      }
    }
  }

  return false
}

function boxOverlapsWithStores(box: {
  sector_color: string
  box_number: number
  street_letter: string
}): boolean {
  const overlapConditions = {
    blue: { range: [33, 56], evenStreet: 'F', oddStreet: 'K' },
    red: { range: [33, 56], evenStreet: 'K', oddStreet: 'F' },
    orange: { range: [33, 56], evenStreet: 'K', oddStreet: 'F' },
    green: { range: [33, 56], evenStreet: 'F', oddStreet: 'K' },
    white: { range: [73, 96], evenStreet: 'K', oddStreet: 'F' },
    yellow: { range: [73, 96], evenStreet: 'F', oddStreet: 'K' },
  }

  const conditions =
    overlapConditions[box.sector_color as keyof typeof overlapConditions]
  if (conditions) {
    const [min, max] = conditions.range
    return (
      box.box_number >= min &&
      box.box_number <= max &&
      (['G', 'H', 'I', 'J'].includes(box.street_letter) ||
        (box.street_letter === conditions.evenStreet &&
          !isOdd(box.box_number)) ||
        (box.street_letter === conditions.oddStreet && isOdd(box.box_number)))
    )
  }

  return false
}

function isOdd(n: number) {
  return Math.abs(n % 2) === 1
}

function boxOverlapsWithFoodCourt(box: {
  sector_color: string
  box_number: number
  street_letter: string
}): boolean {
  if (
    ['blue', 'red', 'orange', 'green'].includes(box.sector_color) &&
    ['A', 'B', 'C', 'D'].includes(box.street_letter) &&
    box.box_number > 88
  ) {
    return true
  }
  if (
    ['blue', 'red', 'orange', 'green'].includes(box.sector_color) &&
    box.street_letter === 'E' &&
    box.box_number > 89 &&
    ((['blue', 'green'].includes(box.sector_color) && isOdd(box.box_number)) ||
      (['orange', 'red'].includes(box.sector_color) && !isOdd(box.box_number)))
  ) {
    return true
  }

  if (
    ['yellow', 'white'].includes(box.sector_color) &&
    ['A', 'B', 'C', 'D'].includes(box.street_letter) &&
    box.box_number > 8 &&
    box.box_number < 41
  ) {
    return true
  }
  if (
    ['white', 'yellow'].includes(box.sector_color) &&
    box.street_letter === 'E' &&
    box.box_number > 9 &&
    box.box_number < 41 &&
    (box.sector_color === 'white'
      ? !isOdd(box.box_number)
      : isOdd(box.box_number))
  ) {
    return true
  }
  return false
}
