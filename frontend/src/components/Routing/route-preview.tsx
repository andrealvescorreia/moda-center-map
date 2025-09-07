import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { ChevronDown } from 'lucide-react'
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

  let inicioName = 'Seu local: '
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

  let detailsContent: React.ReactNode
  if (route.destinos.length > 2) {
    detailsContent = (
      <>
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
      </>
    )
  } else {
    detailsContent = (
      <span>
        {route.destinos.map((destiny, index) => {
          const isThisTheLastDestiny = index === route.destinos.length - 1
          return (
            <DestinyLiItem
              key={`${destiny.position.x}-${destiny.position.y}-index-${index}`}
              index={index}
              destinyName={destiny.sellerName || ''}
              isEndingPoint={isThisTheLastDestiny}
            />
          )
        })}
      </span>
    )
  }

  return (
    <Accordion className="w-full">
      <AccordionSummary
        expandIcon={<ChevronDown />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          height: 40,
          minHeight: 40,
          '&.Mui-expanded': {
            height: 40,
            minHeight: 40,
          },
          pl: 0.2,
        }}
        className="w-full"
      >
        <DestinyLiItem
          index={-1}
          destinyName={inicioName}
          isStartingPoint
          isEndingPoint={route.destinos.length === 0}
        />
      </AccordionSummary>
      <AccordionDetails
        sx={{
          pt: 0,
          pb: 1,
          pl: 0,
        }}
        className="w-full"
      >
        {detailsContent}
      </AccordionDetails>
    </Accordion>
  )
}
