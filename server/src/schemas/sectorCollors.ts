import z from 'zod'

export const sector_colors = z.enum([
  'blue',
  'orange',
  'red',
  'green',
  'yellow',
  'white',
])
