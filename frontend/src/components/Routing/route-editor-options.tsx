import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge' // permite que passamos estilos via className para o componente sem substituir sua estilização padrão. Ou seja, "junta" os dois classNames.

type IconButtonProps = ComponentProps<'button'>

function IconButton({ className, ...props }: IconButtonProps) {
  return (
    <button
      className={twMerge(
        'p-1.5 bg-gray-500 text-blue rounded-md cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300',
        className
      )}
      {...props}
    />
  )
}

export function RouteEditorOptions() {
  return (
    <div className="ui bottom-3">
      <IconButton
        type="button"
        onClick={() => {
          setIsEditingMarcadorInicio(true)
          setIsAddingDestiny(false)
        }}
      >
        Mudar ponto inicial
      </IconButton>

      <button
        type="button"
        disabled={isEditingMarcadorInicio}
        onClick={() => {
          setIsAddingDestiny(true)
          setIsEditingMarcadorInicio(false)
        }}
      >
        Adicionar parada
      </button>
      <div>
        <button type="button" onClick={cancel}>
          Cancelar
        </button>
        <button
          type="button"
          disabled={!route.inicio || route.destinos.length === 0}
          onClick={() => {
            console.log('marcadorInicio: ', route.inicio)
            console.log('marcadoresDestino: ', route.destinos)
          }}
        >
          🔼Iniciar
        </button>
      </div>
    </div>
  )
}
