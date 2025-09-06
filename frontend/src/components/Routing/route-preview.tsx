import { useEffect, useRef } from 'react'
import type { Route } from '../../interfaces/Route'
import DestinyLiItem from './destiny-li-item'

interface RoutePreviewProps {
  route: Route
}
export function RoutePreview({ route }: RoutePreviewProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [])

  let inicioName = 'Seu local - '
  if (route.inicio?.sellingLocation) {
    if (
      'rua' in route.inicio.sellingLocation &&
      'numero' in route.inicio.sellingLocation
    ) {
      inicioName += `${route.inicio.sellingLocation.setor} - Rua ${route.inicio.sellingLocation.rua} - Boxe ${route.inicio.sellingLocation.numero}`
    }
    if (
      'bloco' in route.inicio.sellingLocation &&
      'numLoja' in route.inicio.sellingLocation
    ) {
      inicioName += `${route.inicio.sellingLocation.setor} - Bloco ${route.inicio.sellingLocation.bloco} - Loja ${route.inicio.sellingLocation.numLoja}`
    }
  }

  if (route.destinos.length > 2) {
    return (
      <div className="w-full h-full ">
        <ul className="bg-white  rounded-md py-1" ref={listRef}>
          {route.inicio && (
            <DestinyLiItem
              index={-1}
              destinyName={inicioName}
              isStartingPoint
              isEndingPoint={route.destinos.length === 0}
            />
          )}
          <DestinyLiItem
            index={-1}
            destinyName={`${route.destinos.length - 1} paradas`}
          />
          <DestinyLiItem
            index={route.destinos.length - 1}
            destinyName={
              route.destinos[route.destinos.length - 1].sellerName || ''
            }
            isEndingPoint
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
            destinyName={inicioName}
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
              destinyName={inicioName}
              isEndingPoint={isThisTheLastDestiny}
            />
          )
        })}
      </ul>
    </div>
  )
}
