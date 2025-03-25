import { faPerson } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Destiny } from '../../interfaces/Destiny'
import type { Route } from '../../interfaces/Route'

interface DestinyListProps {
  route: Route
  onClickRemoveDestiny: (index: number) => void
}
export function DestinyList({ route, onClickRemoveDestiny }: DestinyListProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [])
  return (
    <div className="ui absolute w-full flex justify-center items-center top-3">
      <ul
        className="w-100 max-h-45 bg-white overflow-auto shadow rounded-md py-2"
        ref={listRef}
      >
        {route.inicio && (
          <DestinyLiItem
            index={-1}
            destiny={route.inicio}
            isStartingPoint
            isEndingPoint={route.destinos.length === 0}
          />
        )}
        {route.destinos.map((destiny, index) => {
          const isThisTheLastDestiny = index === route.destinos.length - 1
          return (
            <DestinyLiItem
              key={`${destiny.position.x}-${destiny.position.y}-index-${index}`}
              index={index}
              destiny={destiny}
              onClickRemoveDestiny={onClickRemoveDestiny}
              isEndingPoint={isThisTheLastDestiny}
            />
          )
        })}
      </ul>
    </div>
  )
}

interface DestinyLiItemProps {
  index: number
  destiny: Destiny
  isStartingPoint?: boolean
  isEndingPoint?: boolean
  onClickRemoveDestiny?: (index: number) => void
}
function DestinyLiItem({
  index,
  destiny,
  isStartingPoint,
  isEndingPoint,
  onClickRemoveDestiny,
}: DestinyLiItemProps) {
  if (!destiny.sellingLocation) return null

  let location = ''
  const locationName = isStartingPoint ? 'Seu local' : destiny.sellerName
  let leftIcon: JSX.Element

  if ('rua' in destiny.sellingLocation && 'numero') {
    location = `${destiny.sellingLocation.setor} - Rua ${destiny.sellingLocation.rua} - Boxe ${destiny.sellingLocation.numero}`
  }
  if ('bloco' in destiny.sellingLocation && 'numLoja') {
    location = `${destiny.sellingLocation.setor} - Bloco ${destiny.sellingLocation.bloco} - Loja ${destiny.sellingLocation.numLoja}`
  }

  if (isStartingPoint) {
    leftIcon = (
      <FontAwesomeIcon icon={faPerson} className="size-10 text-gray02" />
    )
  } else if (isEndingPoint) {
    leftIcon = (
      <span className="bg-gray02 text-white size-[16px] flex border border-gray03 justify-center items-center rounded-2xl text-xs">
        {index + 1}
      </span>
    )
  } else {
    leftIcon = (
      <span className="bg-white text-gray02 size-[16px] flex border border-gray02 justify-center items-center rounded-2xl text-xs">
        {index + 1}
      </span>
    )
  }
  const divider = (
    <div className="bg-gray05 w-full h-[1.2px]  absolute bottom-0 rounded-2xl" />
  )

  const upwardsLine = (
    <div className=" h-3 absolute top-0 border-solid border-[1.4px] border-gray05" />
  )
  const downardsLine = (
    <div className=" h-3 absolute bottom-0 border-solid border-[1.4px] border-gray05" />
  )

  return (
    <li
      key={`${destiny.sellingLocation.setor}-${destiny.position.x}-${destiny.position.y}`}
      className="list-none w-full h-14
       px-4 gap-1 grid grid-cols-[8%_auto_8%] items-center"
    >
      <div className="h-full flex justify-center items-center relative">
        {!isStartingPoint && upwardsLine}
        {leftIcon}
        {!isEndingPoint && downardsLine}
      </div>
      <div className="h-full flex flex-col relative gap-0">
        <div className="text-xl">{locationName}</div>
        <div className="text-base -mt-1">{location}</div>
        {!isEndingPoint && divider}
      </div>
      {!isStartingPoint && (
        <button
          type="button"
          className="ml-auto"
          onClick={() => onClickRemoveDestiny?.(index)}
        >
          <X size={20} className="hover:cursor-pointer" />
        </button>
      )}
    </li>
  )
}
