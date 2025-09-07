import { ArrowLeft } from 'lucide-react'
import { type SnackbarKey, closeSnackbar, enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { DestinyList } from '../../../components/Routing/destiny-list'
import SellerByLocation from '../../../components/seller-by-location'
import type { Boxe } from '../../../interfaces/Boxe'
import type { Destiny } from '../../../interfaces/Destiny'
import type { Loja } from '../../../interfaces/Loja'
import { useRouteContext } from '../../../providers/RouteProvider'
import type { BoxeSchema } from '../../../schemas/box'
import type { StoreSchema } from '../../../schemas/store'
import { colorToEnglishMap } from '../../../utils/utils'
import { addDestiny, removeDestiny } from './route-service'

export default function RouteContent() {
  const { route, setRoute } = useRouteContext()
  if (!route) return null

  const [destinyView, setDestinyView] = useState<Loja | Boxe | null>(null)

  const [convertedDestinyView, setConvertedDestinyView] = useState<
    StoreSchema | BoxeSchema | null
  >(null)

  useEffect(() => {
    if (destinyView === null) {
      setConvertedDestinyView(null)
      return
    }
    const convertedDestiny =
      'numero' in destinyView
        ? {
            box_number: destinyView.numero,
            sector_color: colorToEnglishMap[destinyView.setor],
            street_letter: destinyView.rua,
          }
        : {
            block_number: destinyView.bloco,
            store_number: destinyView.numLoja,
            sector_color: colorToEnglishMap[destinyView.setor],
          }
    setConvertedDestinyView(convertedDestiny)
  }, [destinyView])

  const createDestiny = (
    sellingLocation: Loja | Boxe,
    sellerName: string,
    sellerId: string | undefined
  ) => {
    const position =
      'rua' in sellingLocation
        ? {
            y: sellingLocation.positionInGrid.y,
            x: sellingLocation.positionInGrid.x,
          }
        : sellingLocation.getEntrance()

    const destiny: Destiny = {
      sellingLocation,
      position,
      sellerName,
      sellerId,
    }
    return destiny
  }

  const addTheDestiny = (destiny: Destiny) => {
    const newRoute = addDestiny(route, destiny)
    setRoute(newRoute)
  }
  const snackbarActions =
    (removedDestiny: Destiny) => (snackbarId: SnackbarKey) => (
      <div className="flex gap-2">
        <button
          type="button"
          className="px-3 py-1 text-green-primary hover:cursor-pointer"
          onClick={() => {
            const sellingLocation = removedDestiny.sellingLocation
            if (sellingLocation && removedDestiny.sellerName) {
              const destiny = createDestiny(
                sellingLocation,
                removedDestiny.sellerName,
                removedDestiny.sellerId
              )
              addTheDestiny(destiny)
            }
            closeSnackbar(snackbarId)
          }}
        >
          Desfazer
        </button>
        <button
          type="button"
          className="px-3 py-1 text-danger hover:cursor-pointer"
          onClick={() => {
            closeSnackbar(snackbarId)
          }}
        >
          Fechar
        </button>
      </div>
    )
  return (
    <>
      {convertedDestinyView && (
        <div className="w-full h-full  bg-white z-[99999] flex flex-col fixed top-0 right-0">
          <button
            type="button"
            className="self-start mt-3 ml-3"
            onClick={() => setDestinyView(null)}
          >
            <ArrowLeft className="text-gray04 hover:cursor-pointer" size={28} />
          </button>
          <SellerByLocation
            location={convertedDestinyView}
            onClickRemoveDestiny={() => {
              if (!convertedDestinyView) return
              const destinyIndex = route.destinos.findIndex(
                (destiny) => destiny.sellingLocation === destinyView
              )
              if (destinyIndex === -1) return
              const newRoute = removeDestiny(route, destinyIndex)
              setRoute(newRoute)
              setDestinyView(null)
              setConvertedDestinyView(null)
            }}
          />
        </div>
      )}
      <div className="pr-3 md:text-xs pb-15">
        <DestinyList
          route={{ ...route, inicio: route.inicio }}
          onClickRemoveDestiny={(index) => {
            enqueueSnackbar(
              `"${route.destinos[index].sellerName}" removido da rota`,
              {
                action: snackbarActions(route.destinos[index]),
                autoHideDuration: 6000,
              }
            )
            const newRoute = removeDestiny(route, index)
            setRoute(newRoute)
          }}
          onClickDestiny={(index) => {
            const destiny = route.destinos[index]
            if (!destiny.sellingLocation) return
            setDestinyView(destiny.sellingLocation)
          }}
        />
      </div>
    </>
  )
}
