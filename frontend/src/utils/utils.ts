import type { BoxeResponse, StoreResponse } from '../http/responses'
import type { Boxe } from '../interfaces/Boxe'
import type { BoxeSchema } from '../schemas/box'

const colorToPortugueseMap: Record<string, Boxe['setor']> = {
  blue: 'Azul',
  orange: 'Laranja',
  red: 'Vermelho',
  green: 'Verde',
  yellow: 'Amarelo',
  white: 'Branco',
}

const colorToEnglishMap: Record<string, BoxeSchema['sector_color']> = {
  Azul: 'blue',
  Laranja: 'orange',
  Vermelho: 'red',
  Verde: 'green',
  Amarelo: 'yellow',
  Branco: 'white',
}

const formatPhoneNumber = (phone?: string) =>
  phone?.replace(
    phone.length === 11 ? /(\d{2})(\d{5})(\d{4})/ : /(\d{2})(\d{4})(\d{4})/,
    '($1) $2-$3'
  ) || phone

function sellingLocationToText(location: BoxeResponse | StoreResponse) {
  if ('box_number' in location) {
    return `Setor ${colorToPortugueseMap[location.sector_color] || 'Branco'} - Rua ${
      location.street_letter
    } - Box ${location.box_number}`
  }
  return `Setor ${colorToPortugueseMap[location.sector_color] || 'Branco'} - Bloco ${
    location.block_number
  } - Loja ${location.store_number}`
}

export {
  colorToPortugueseMap as colorMap,
  colorToEnglishMap,
  formatPhoneNumber,
  sellingLocationToText,
}
