import { faPerson } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Destiny } from '../../interfaces/Destiny'
import type { Route } from '../../interfaces/Route'

interface DestinyListProps {
  route: Route
  onClickRemoveDestiny: (index: number) => void
  reducedView?: boolean
}
export function DestinyList({
  route,
  onClickRemoveDestiny,
  reducedView = false,
}: DestinyListProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [])

  if (reducedView && route.destinos.length > 2) {
    const divider = (
      <div className="bg-gray05 w-full h-[1.2px] absolute bottom-0 rounded-2xl" />
    )
    const downardsLine = (
      <div className=" h-3 absolute bottom-0 border-solid border-[1.4px] border-gray05" />
    )
    const upwardsLine = (
      <div className=" h-3 absolute top-0 border-solid border-[1.4px] border-gray05" />
    )
    return (
      <div className="w-full h-full ">
        <ul className="bg-white  rounded-md py-2" ref={listRef}>
          {route.inicio && (
            <DestinyLiItem
              index={-1}
              destiny={route.inicio}
              isStartingPoint
              isEndingPoint={route.destinos.length === 0}
            />
          )}

          <li className="list-none w-full h-10 px-2 gap-1 grid grid-cols-[8%_auto_8%] items-center">
            <div className="h-full flex justify-center items-center relative">
              {upwardsLine}
              <span className="bg-white text-gray02 size-[16px] flex border border-gray02 justify-center items-center rounded-2xl text-xs" />
              {downardsLine}
            </div>
            <div className="h-full flex flex-col relative gap-0 justify-center">
              <div className="text-base">
                {route.destinos.length - 1} paradas
              </div>

              {divider}
            </div>
          </li>

          <DestinyLiItem
            index={route.destinos.length - 1}
            destiny={route.destinos[route.destinos.length - 1]}
            isEndingPoint
          />
        </ul>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ul className="bg-white  rounded-md py-2" ref={listRef}>
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
      className="list-none w-full h-10 md:h-12
       px-2 gap-1 grid grid-cols-[8%_auto_8%] items-center"
    >
      <div className="h-full flex justify-center items-center relative">
        {!isStartingPoint && upwardsLine}
        {leftIcon}
        {!isEndingPoint && downardsLine}
      </div>
      <div className="h-full flex flex-col relative gap-0">
        <p className="text-base md:text-sm">{locationName}</p>
        <p className="text-sm -mt-2 md:mt-0 md:text-xs text-gray04">
          {location}
        </p>
        {!isEndingPoint && divider}
      </div>
      {!isStartingPoint && (
        <button
          type="button"
          className="ml-auto"
          onClick={() => onClickRemoveDestiny?.(index)}
        >
          <X size={16} className="hover:cursor-pointer" />
        </button>
      )}
    </li>
  )
}
