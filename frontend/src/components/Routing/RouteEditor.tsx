import { useEffect, useState } from 'react'
import type { Loja } from '../../interfaces/Loja'
import type { Route } from '../../interfaces/Route'
import { ModaCenterGridMap } from '../../models/ModaCenterGridMap'
import { useClickContext } from '../../providers/ClickProvider'
import { SearchStore } from '../SearchStore'
import { DialogAction } from './dialog-action'

interface RouteEditorProps {
  gridMap: ModaCenterGridMap
  route: Route
  onUpdate: (route: Route) => void
  onCancel: () => void
}

const RouteEditor = ({
  gridMap,
  route,
  onUpdate,
  onCancel,
}: RouteEditorProps) => {
  const [isEditingMarcadorInicio, setIsEditingMarcadorInicio] = useState(true)
  const [isAddingDestiny, setIsAddingDestiny] = useState(false)
  const [isAddingDestinyFromMap, setIsAddingDestinyFromMap] = useState(false)
  const { clickLocation } = useClickContext()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const isInsideGridMap = (lat: number, lng: number) => {
      return (
        lat >= 0 &&
        lat < gridMap.getDimensions()[0] &&
        lng >= 0 &&
        lng < gridMap.getDimensions()[1]
      )
    }
    if (!clickLocation) return
    if (!isInsideGridMap(clickLocation.lat, clickLocation.lng)) return

    const y = clickLocation.lat
    let x = clickLocation.lng
    if (
      isEditingMarcadorInicio &&
      gridMap.getGrid()[clickLocation.lat][clickLocation.lng] ===
        ModaCenterGridMap.BOXE
    ) {
      if (
        gridMap.getGrid()[clickLocation.lat][clickLocation.lng + 1] ===
        ModaCenterGridMap.CAMINHO
      ) {
        x = clickLocation.lng + 1
      } else if (
        gridMap.getGrid()[clickLocation.lat][clickLocation.lng - 1] ===
        ModaCenterGridMap.CAMINHO
      ) {
        x = clickLocation.lng - 1
      }
    }

    if (isEditingMarcadorInicio && gridMap.getGrid()[y][x] === 0) {
      const newRoute = {
        ...route,
        inicio: {
          position: { x, y },
          info: null,
        },
      }
      onUpdate(newRoute)
    }
    if (
      isAddingDestiny &&
      gridMap.getGrid()[clickLocation.lat][clickLocation.lng] ===
        ModaCenterGridMap.BOXE
    ) {
      const boxe = gridMap.getBoxe(clickLocation.lat, clickLocation.lng)

      if (boxe === null) return
      const newRoute = {
        ...route,
        destinos: [
          ...route.destinos,
          {
            info: boxe || null,
            position: { x: clickLocation.lng, y: clickLocation.lat },
          },
        ],
      }
      onUpdate(newRoute)
      setIsAddingDestiny(false)
    }

    if (
      isAddingDestiny &&
      gridMap.getGrid()[clickLocation.lat][clickLocation.lng] ===
        ModaCenterGridMap.LOJA
    ) {
      const loja = gridMap.getLoja(clickLocation.lat, clickLocation.lng)
      if (!loja) return
      const entrance = loja.getEntrance()
      const newRoute = {
        ...route,
        destinos: [
          ...route.destinos,
          {
            info: loja as Loja,
            position: entrance,
          },
        ],
      }
      onUpdate(newRoute)
      setIsAddingDestiny(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onUpdate, clickLocation])

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

  if (isEditingMarcadorInicio) {
    return (
      <span className="ui flex w-full justify-center top-3">
        <span className="w-98">
          <DialogAction
            title="Informe o local de início"
            text="Clique em um ponto caminhável no mapa"
            onAccept={() => setIsEditingMarcadorInicio(false)}
            onCancel={cancel}
            acceptEnabled={route.inicio !== null}
          />
        </span>
      </span>
    )
  }

  if (!isAddingDestiny && route.inicio) {
    return (
      <div className="ui">
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
      </div>
    )
  }

  if (isAddingDestinyFromMap) {
    return (
      <span className="ui flex w-full justify-center top-3">
        <span className="w-98">
          <DialogAction
            title="Informe o local de destino"
            text="Clique em um ponto de venda no mapa"
            onAccept={() => {
              setIsAddingDestinyFromMap(false)
              setIsAddingDestiny(false)
            }}
            onCancel={() => {
              setIsAddingDestiny(false)
            }}
          />
        </span>
      </span>
    )
  }

  if (isAddingDestiny) {
    return (
      <SearchStore
        onCancel={() => {
          setIsAddingDestiny(false)
        }}
        onChooseOnMap={() => {
          setIsAddingDestinyFromMap(true)
        }}
      />
    )
  }

  return null
}

export default RouteEditor
