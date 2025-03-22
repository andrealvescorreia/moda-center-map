import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap/CSSPlugin'

gsap.registerPlugin(CSSPlugin)
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { ArrowLeft, CircleX, Map } from 'lucide-react'
import { type ComponentProps, useEffect, useRef } from 'react'
import { InputField, InputIcon, InputRoot } from './input'

interface SearchStoreProps {
  onCancel?: () => void
  onChooseOnMap?: () => void
}

export function SearchStore({ onChooseOnMap, onCancel }: SearchStoreProps) {
  const element = useRef<HTMLDivElement>(null)
  useEffect(() => {
    gsap.fromTo(
      element.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    )
  }, [])
  return (
    <div
      ref={element}
      className="ui absolute 100dvh 100dvw w-full h-full bg-white"
    >
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
