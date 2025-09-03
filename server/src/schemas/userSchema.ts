import z from 'zod'

export const localUserRegister = z.object({
  username: z.string().nonempty().min(3).max(255),
  password: z.string().nonempty().min(6).max(50),
})

export type LocalUserRegisterType = z.infer<typeof localUserRegister>
