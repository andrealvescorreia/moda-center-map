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
export { colorMap, formatPhoneNumber }
