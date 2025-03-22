import type { BoxeResponse, StoreResponse } from '../http/responses'
import type { Boxe } from '../interfaces/Boxe'

const colorMap: Record<string, Boxe['setor']> = {
  blue: 'Azul',
  orange: 'Laranja',
  red: 'Vermelho',
  green: 'Verde',
  yellow: 'Amarelo',
  white: 'Branco',
}
const formatPhoneNumber = (phone?: string) =>
  phone?.replace(
    phone.length === 11 ? /(\d{2})(\d{5})(\d{4})/ : /(\d{2})(\d{4})(\d{4})/,
    '($1) $2-$3'
  ) || phone

function sellingLocationToText(location: BoxeResponse | StoreResponse) {
  if ('box_number' in location) {
    return `Setor ${colorMap[location.sector_color] || 'Branco'} - Rua ${
      location.street_letter
    } - Box ${location.box_number}`
  }
  return `Setor ${colorMap[location.sector_color] || 'Branco'} - Bloco ${
    location.block_number
  } - Loja ${location.store_number}`
}

export { colorMap, formatPhoneNumber, sellingLocationToText }
