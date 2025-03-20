import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { ArrowRight, Eye, EyeOff, KeyRound, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/button'
import { InputField, InputIcon, InputRoot } from '../../components/input'
import { loginUser } from '../../http/api'
import { useUserContext } from '../../providers/UserProvider'
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

type RegistrationSchema = z.infer<typeof loginSchema>

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistrationSchema>({
    resolver: zodResolver(loginSchema),
  })
  const { setUser } = useUserContext()

  const [showPassword, setShowPassword] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()

  async function onRegister({ username, password }: RegistrationSchema) {
    try {
      setIsFetching(true)
      const response = await loginUser({ username, password })
      setUser(response.data)
      navigate('/user')
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          if (error.response?.data.errors[0] === 'Senha inválida') {
            setError('password', {
              type: 'custom',
              message: 'Senha inválida',
            })
          } else if (error.response?.data.errors[0] === 'Usuario não existe') {
            setError('username', {
              type: 'custom',
              message: 'Usuário não encontrado',
            })
          } else {
            setError('username', {
              type: 'custom',
              message: 'Erro inesperado',
            })
          }
        } else {
          alert('Erro inesperado')
        }
      }
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onRegister)}
      className="p-8 space-y-6 w-full md:max-w-[440px] md:border border-gray05 md:shadow-lg md:rounded-2xl"
    >
      <h2 className="font-heading text-gray04 font-semibold text-xl">ENTRAR</h2>

      <div className="space-y-3">
        <div className="space-y-2">
          <InputRoot>
            <InputIcon>
              <User />
            </InputIcon>
            <InputField
              placeholder="Nome de usuário"
              type="text"
              autoFocus
              {...register('username')}
            />
          </InputRoot>

          {errors?.username && (
            <p className="font-semibold text-xs text-danger">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <InputRoot>
            <InputIcon>
              <KeyRound />
            </InputIcon>
            <InputField
              placeholder="Senha"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
            />

            <button
              type="button"
              className="hover:cursor-pointer flex"
              onClick={() => {
                setShowPassword(!showPassword)
              }}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </InputRoot>
          {errors?.password && (
            <p className="font-semibold text-xs text-danger">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <Button disabled={isFetching} type="submit">
        Confirmar
        <ArrowRight />
      </Button>
    </form>
  )
}
