// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { ArrowLeft, CircleX, Map } from 'lucide-react'
import type { ComponentProps } from 'react'
import type { Boxe } from '../interfaces/Boxe'
import type { Loja } from '../interfaces/Loja'
import { InputField, InputIcon, InputRoot } from './input'

interface SearchStoreProps {
  onCancel?: () => void
  onChooseOnMap?: () => void
  onChooseFromList?: (store: Loja | Boxe) => void
}

type ChooseOnMapProps = ComponentProps<'button'>
function ChooseOnMap(props: ChooseOnMapProps) {
  return (
    <button
      className="w-full hover:cursor-pointer bg-gray01 flex items-center gap-3 p-4 rounded-sm shadow-md hover:bg-gray07"
      type="button"
      {...props}
    >
      <Map />
      Escolher no mapa
    </button>
  )
}

export function SearchStore({
  onChooseOnMap,
  onCancel,
  onChooseFromList, //TODO -> necessita do backend
}: SearchStoreProps) {
  return (
    <div className="ui 100dvh 100dvw w-full h-full bg-white">
      <div className="flex flex-col gap-4 p-4">
        <InputRoot>
          <InputIcon>
            <ArrowLeft className="cursor-pointer" onClick={onCancel} />
          </InputIcon>
          <InputField placeholder="Informe o destino" />
          <InputIcon>
            <CircleX className="cursor-pointer" onClick={onCancel} />
          </InputIcon>
        </InputRoot>

        <ChooseOnMap onClick={onChooseOnMap} />
      </div>
    </div>
  )
}
