import { z } from 'zod'

const sector_colors = z.enum(
  ['blue', 'orange', 'red', 'green', 'yellow', 'white'],
  {
    message: 'Setor inválido',
  }
)

export default sector_colors
