import { useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import type { Route } from '../../interfaces/Route'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'

interface RouteEditorProps {
  gridMap: ModaCenterGridMap
  route: Route
  onUpdate: (route: Route) => void
  onCancel: () => void
}

const ClickPosition: React.FC<{
  onClick: (lat: number, lng: number) => void
}> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      onClick(Number.parseInt(lat.toString()), Number.parseInt(lng.toString()))
    },
  })
  return false
}

const RouteEditor = ({
  gridMap,
  route,
  onUpdate,
  onCancel,
}: RouteEditorProps) => {
  const [isEditingMarcadorInicio, setIsEditingMarcadorInicio] = useState(true)
  const [isAddingDestiny, setIsAddingDestiny] = useState(false)

  const isInsideGridMap = (lat: number, lng: number) => {
    return (
      lat >= 0 &&
      lat < gridMap.getDimensions()[0] &&
      lng >= 0 &&
      lng < gridMap.getDimensions()[1]
    )
  }

  const onClickMouse = (lat: number, lng: number) => {
    if (!isInsideGridMap(lat, lng)) return

    if (isEditingMarcadorInicio && gridMap.getGrid()[lat][lng] === 0) {
      const newRoute = {
        ...route,
        inicio: {
          position: { x: lng, y: lat },
          info: null,
        },
      }
      onUpdate(newRoute)
      setIsEditingMarcadorInicio(false)
    }
    if (
      isAddingDestiny &&
      gridMap.getGrid()[lat][lng] === ModaCenterGridMap.BOXE
    ) {
      const boxe = gridMap.getBoxe(lat, lng)

      if (boxe === null) return
      const newRoute = {
        ...route,
        destinos: [
          ...route.destinos,
          {
            info: boxe,
            position: { x: lng, y: lat },
          },
        ],
      }
      onUpdate(newRoute)
      setIsAddingDestiny(false)
    }

    if (
      isAddingDestiny &&
      gridMap.getGrid()[lat][lng] === ModaCenterGridMap.LOJA
    ) {
      const loja = gridMap.getLoja(lat, lng)
      if (!loja) return
      const entrance = loja.getEntrance()
      const newRoute = {
        ...route,
        destinos: [
          ...route.destinos,
          {
            info: loja,
            position: entrance,
          },
        ],
      }
      onUpdate(newRoute)
      setIsAddingDestiny(false)
    }
  }

  const removeDestiny = (index: number) => {
    const newRoute = {
      ...route,
      destinos: route.destinos.filter((_, i) => i !== index),
    }
    onUpdate(newRoute)
  }

  const cancel = () => {
    setIsEditingMarcadorInicio(false)
    setIsAddingDestiny(false)
    onCancel()
  }

  return (
    <div className="route-editor-content">
      <ClickPosition onClick={onClickMouse} />

      {isEditingMarcadorInicio && <div>Clique no local de início</div>}

      {route.inicio && !isEditingMarcadorInicio && (
        <button
          type="button"
          onClick={() => {
            setIsEditingMarcadorInicio(true)
            setIsAddingDestiny(false)
          }}
        >
          Posição inicial: {route.inicio.position.x} {
            route.inicio.position.y
          }{' '}
        </button>
      )}

      {route.destinos.map((destiny, index) => {
        if (!destiny.info) return null
        if ('rua' in destiny.info && 'numero' in destiny.info)
          return (
            <div
              key={`${destiny.info.setor}-${destiny.info.rua}-${destiny.info.numero}`}
            >
              Destino {index + 1}: Setor {destiny.info.setor} Rua{' '}
              {destiny.info.rua} Boxe {destiny.info.numero}
              <button type="button" onClick={() => removeDestiny(index)}>
                X
              </button>
            </div>
          )
        if ('bloco' in destiny.info && 'numLoja' in destiny.info)
          return (
            <div
              key={`${destiny.info.setor}-${destiny.info.bloco}-${destiny.info.numLoja}`}
            >
              Destino {index + 1}: Setor {destiny.info.setor} Bloco{' '}
              {destiny.info.bloco} Loja {destiny.info.numLoja}
              <button type="button" onClick={() => removeDestiny(index)}>
                X
              </button>
            </div>
          )
      })}

      {!isAddingDestiny && (
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
      )}

      {isAddingDestiny && <div>Clique no Boxe destino</div>}
      <br />
      {
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
      }
    </div>
  )
}

export default RouteEditor
