import { faPerson } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { X } from 'lucide-react'
import type { Boxe } from '../../interfaces/Boxe'
import type { Loja } from '../../interfaces/Loja'

interface DestinyLiItemProps {
  index: number
  destinyName: string
  sellingLocation?: Boxe | Loja // if not provided, shows only destinyName
  isStartingPoint?: boolean // true = adds a line downwards only
  isEndingPoint?: boolean // true = adds a line upwards only
  // if both are false, adds lines both upwards and downwards
  // if both are true, adds no lines

  onClickRemoveDestiny?: (index: number) => void // if not provided, no button to remove destiny is shown
  onClickDestiny?: (index: number) => void // if not provided, no hover effect and click action
}
export function DestinyLiItem({
  index,
  destinyName,
  sellingLocation,
  isStartingPoint,
  isEndingPoint,
  onClickRemoveDestiny,
  onClickDestiny,
}: DestinyLiItemProps) {
  let location = ''
  if (sellingLocation) {
    if ('rua' in sellingLocation && 'numero') {
      location = `${sellingLocation.setor} - Rua ${sellingLocation.rua} - Boxe ${sellingLocation.numero}`
    }
    if ('bloco' in sellingLocation && 'numLoja') {
      location = `${sellingLocation.setor} - Bloco ${sellingLocation.bloco} - Loja ${sellingLocation.numLoja}`
    }
  }

  let leftIcon: JSX.Element

  if (isStartingPoint) {
    leftIcon = (
      <FontAwesomeIcon icon={faPerson} className="size-10 text-gray02" />
    )
  } else if (isEndingPoint) {
    leftIcon = (
      <span className="bg-gray02 text-white size-[16px] flex border border-gray03 justify-center items-center rounded-2xl text-xs">
        {index >= 0 ? index + 1 : ''}
      </span>
    )
  } else {
    leftIcon = (
      <span className="bg-white text-gray02 size-[16px] flex border border-gray02 justify-center items-center rounded-2xl text-xs">
        {index >= 0 ? index + 1 : ''}
      </span>
    )
  }

  const upwardsLine = (
    <div className="h-[50%] absolute -top-2 border-solid border-[1.4px] border-gray05" />
  )
  const downardsLine = (
    <div className="h-[50%] absolute -bottom-2 border-solid border-[1.4px] border-gray05" />
  )

  return (
    <li
      key={`${index}`}
      className={`list-none w-full max-h-12
       px-2 gap-1 grid grid-cols-[8%_auto_8%] items-center ${sellingLocation ? 'py-1.5' : 'py-1'}`}
    >
      <div className="h-full flex justify-center items-center relative">
        {!isStartingPoint && upwardsLine}
        {leftIcon}
        {!isEndingPoint && downardsLine}
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className={`h-full flex flex-col relative gap-0 transition ${onClickDestiny ? 'hover:cursor-pointer hover:bg-gray-200 active:bg-gray-200 rounded' : ''}`}
        onClick={() => onClickDestiny?.(index)}
      >
        <p className="text-base md:text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[70vw]">
          {destinyName}
        </p>

        <p className="text-sm -mt-1.2 md:mt-0 md:text-xs text-gray04">
          {location}
        </p>
      </div>
      {onClickRemoveDestiny && (
        <button
          type="button"
          className="ml-auto"
          onClick={() => onClickRemoveDestiny(index)}
        >
          <X
            size={18}
            className="hover:cursor-pointer hover:bg-gray-200 rounded-2xl active:bg-gray-200 transition"
          />
        </button>
      )}
    </li>
  )
}
export default DestinyLiItem
