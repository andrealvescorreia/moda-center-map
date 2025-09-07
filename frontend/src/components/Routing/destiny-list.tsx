import { useEffect, useRef } from 'react'
import type { Route } from '../../interfaces/Route'
import DestinyLiItem from './destiny-li-item'

interface DestinyListProps {
  route: Route
  onClickRemoveDestiny: (index: number) => void
  reducedView?: boolean
  onClickDestiny?: (index: number) => void
}
export function DestinyList({
  route,
  onClickRemoveDestiny,
  onClickDestiny,
}: DestinyListProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [])

  return (
    <div className="w-full h-full">
      <ul className="bg-white  rounded-md " ref={listRef}>
        {route.inicio && (
          <DestinyLiItem
            index={-1}
            destinyName="Seu local"
            sellingLocation={route.inicio.sellingLocation || undefined}
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
              destinyName={destiny.sellerName || ''}
              sellingLocation={destiny.sellingLocation || undefined}
              onClickRemoveDestiny={onClickRemoveDestiny}
              onClickDestiny={onClickDestiny}
              isEndingPoint={isThisTheLastDestiny}
            />
          )
        })}
      </ul>
    </div>
  )
}
