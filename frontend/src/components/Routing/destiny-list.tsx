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
  onClickDestiny?: (destiny: Destiny) => void
}
export function DestinyList({
  route,
  onClickRemoveDestiny,
  reducedView = false,
  onClickDestiny,
}: DestinyListProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [])

  if (reducedView && route.destinos.length > 2) {
    const upwardsLine = (
      <div className="h-[50%] absolute -top-2 border-solid border-[1.4px] border-gray05" />
    )
    const downardsLine = (
      <div className="h-[50%] absolute -bottom-2 border-solid border-[1.4px] border-gray05" />
    )

    return (
      <div className="w-full h-full ">
        <ul className="bg-white  rounded-md" ref={listRef}>
          {route.inicio && (
            <DestinyLiItem
              index={-1}
              destiny={route.inicio}
              isStartingPoint
              isEndingPoint={route.destinos.length === 0}
              reducedView={reducedView}
            />
          )}

          <li className="list-none w-full h-7 px-2 gap-1 grid grid-cols-[8%_auto_8%] items-center">
            <div className="h-full flex justify-center items-center relative">
              {upwardsLine}
              <span className="bg-white text-gray02 size-[16px] flex border border-gray02 justify-center items-center rounded-2xl text-xs" />
              {downardsLine}
            </div>
            <div className="h-full flex flex-col relative gap-0 justify-center">
              <div className="text-base">
                {route.destinos.length - 1} paradas
              </div>
            </div>
          </li>

          <DestinyLiItem
            index={route.destinos.length - 1}
            destiny={route.destinos[route.destinos.length - 1]}
            isEndingPoint
            reducedView={reducedView}
          />
        </ul>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ul className="bg-white  rounded-md " ref={listRef}>
        {route.inicio && (
          <DestinyLiItem
            index={-1}
            destiny={route.inicio}
            isStartingPoint
            isEndingPoint={route.destinos.length === 0}
            reducedView={reducedView}
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
              onClickDestiny={onClickDestiny}
              isEndingPoint={isThisTheLastDestiny}
              reducedView={reducedView}
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
  onClickDestiny?: (destiny: Destiny) => void
  reducedView?: boolean
}
function DestinyLiItem({
  index,
  destiny,
  isStartingPoint,
  isEndingPoint,
  onClickRemoveDestiny,
  onClickDestiny,
  reducedView = false,
}: DestinyLiItemProps) {
  if (!destiny.sellingLocation) return null

  let location = ''
  if ('rua' in destiny.sellingLocation && 'numero') {
    location = `${destiny.sellingLocation.setor} - Rua ${destiny.sellingLocation.rua} - Boxe ${destiny.sellingLocation.numero}`
  }
  if ('bloco' in destiny.sellingLocation && 'numLoja') {
    location = `${destiny.sellingLocation.setor} - Bloco ${destiny.sellingLocation.bloco} - Loja ${destiny.sellingLocation.numLoja}`
  }

  const locationName = isStartingPoint
    ? `Seu local ${reducedView ? `- ${location}` : ''}`
    : destiny.sellerName
  let leftIcon: JSX.Element

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

  const upwardsLine = (
    <div className="h-[50%] absolute -top-2 border-solid border-[1.4px] border-gray05" />
  )
  const downardsLine = (
    <div className="h-[50%] absolute -bottom-2 border-solid border-[1.4px] border-gray05" />
  )

  return (
    <li
      key={`${destiny.sellingLocation.setor}-${destiny.position.x}-${destiny.position.y}`}
      className="list-none w-full py-1.5 max-h-12
       px-2 gap-1 grid grid-cols-[8%_auto_8%] items-center"
    >
      <div className="h-full flex justify-center items-center relative">
        {!isStartingPoint && upwardsLine}
        {leftIcon}
        {!isEndingPoint && downardsLine}
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className={`h-full flex flex-col relative gap-0 transition${isStartingPoint ? '' : ' hover:cursor-pointer hover:bg-gray-200 active:bg-gray-200 rounded'}`}
        onClick={() => onClickDestiny?.(destiny)}
      >
        <p className="text-base md:text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[70vw]">
          {locationName}
        </p>
        {!reducedView && (
          <p className="text-sm -mt-1.2 md:mt-0 md:text-xs text-gray04">
            {location}
          </p>
        )}
      </div>
      {!isStartingPoint && !reducedView && (
        <button
          type="button"
          className="ml-auto"
          onClick={() => onClickRemoveDestiny?.(index)}
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
