import z from 'zod'

const bodySchema = z.object({
  username: z.string().nonempty().min(3).max(255),
})

export default bodySchema
