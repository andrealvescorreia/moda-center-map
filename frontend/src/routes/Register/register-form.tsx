import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { ArrowRight, Eye, EyeOff, KeyRound, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import errorsCode from '../../../../shared/operation-errors'
import { Button } from '../../components/button'
import { InputField, InputIcon, InputRoot } from '../../components/input'
import { registerUser } from '../../http/api'
import { useLoadingContext } from '../../providers/LoadingProvider'

const registrationSchema = z.object({
  username: z
    .string()
    .min(3, 'Digite um nome de usuário com no mínimo 3 caracteres.')
    .regex(/^\S*$/, 'O nome de usuário não pode conter espaços.'),
  password: z
    .string()
    .min(6, 'Digite uma senha com no mínimo 6 caracteres.')
    .regex(/^\S*$/, 'A senha não pode conter espaços.'),
})

type RegistrationSchema = z.infer<typeof registrationSchema>

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistrationSchema>({
    resolver: zodResolver(registrationSchema),
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { setLoading } = useLoadingContext()
  const navigate = useNavigate()

  async function onRegister({ username, password }: RegistrationSchema) {
    try {
      setIsFetching(true)
      setLoading(true)
      const response = await registerUser({ username, password })
      if (response.status === 201) {
        alert('Registrado com sucesso! Realize o login.')
        navigate('/login')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.errors[0].code === errorsCode.ALREADY_IN_USE) {
          setError('username', {
            message: 'Usuário já existe!',
            type: 'custom',
          })
        }
      }
    } finally {
      setIsFetching(false)
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onRegister)}
      className="p-8 space-y-6 w-full md:max-w-[440px] md:border border-gray05 md:shadow-lg md:rounded-2xl"
    >
      <h2 className="font-heading text-gray04 font-semibold text-xl">
        CRIAR CONTA
      </h2>

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
