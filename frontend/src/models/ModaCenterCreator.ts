import ModaCenter from './ModaCenter'
import SetorFacade from './Setor/Facade'

export default class ModaCenterCreator {
  #gapBetweenStoresHorizontal = 4
  #gapBetweenStoresVertical = 1
  setGapBetweenStoresVertical(gap: number) {
    this.#gapBetweenStoresVertical = gap
  }
  setGapBetweenStoresHorizontal(gap: number) {
    this.#gapBetweenStoresHorizontal = gap
  }
  create() {
    const setorAzul = new SetorFacade().make('Azul', { x: 0, y: 0 })
    const setorLaranja = new SetorFacade().make('Laranja', {
      x: setorAzul.topRight.x + this.#gapBetweenStoresHorizontal,
      y: 0,
    })
    const setorVermelho = new SetorFacade().make('Vermelho', {
      x: setorAzul.leftBottom.x,
      y: setorAzul.topRight.y + this.#gapBetweenStoresVertical,
    })
    const setorVerde = new SetorFacade().make('Verde', {
      x: setorLaranja.leftBottom.x,
      y: setorLaranja.topRight.y + this.#gapBetweenStoresVertical,
    })
    const setorAmarelo = new SetorFacade().make('Amarelo', {
      x: setorVermelho.leftBottom.x,
      y: setorVermelho.topRight.y + this.#gapBetweenStoresVertical,
    })
    const setorBranco = new SetorFacade().make('Branco', {
      x: setorVerde.leftBottom.x,
      y: setorVerde.topRight.y + this.#gapBetweenStoresVertical,
    })

    const modaCenter = new ModaCenter()
    modaCenter.boxes = [
      ...setorAzul.boxes,
      ...setorLaranja.boxes,
      ...setorVermelho.boxes,
      ...setorVerde.boxes,
      ...setorAmarelo.boxes,
      ...setorBranco.boxes,
    ]
    modaCenter.lojas = [
      ...setorAzul.lojas,
      ...setorLaranja.lojas,
      ...setorVermelho.lojas,
      ...setorVerde.lojas,
      ...setorAmarelo.lojas,
      ...setorBranco.lojas,
    ]
    modaCenter.banheiros = [
      ...setorAzul.banheiros,
      ...setorLaranja.banheiros,
      ...setorVermelho.banheiros,
      ...setorVerde.banheiros,
      ...setorAmarelo.banheiros,
      ...setorBranco.banheiros,
    ]
    modaCenter.obstaculos = [
      ...setorAzul.obstaculos,
      ...setorLaranja.obstaculos,
      ...setorVermelho.obstaculos,
      ...setorVerde.obstaculos,
      ...setorAmarelo.obstaculos,
      ...setorBranco.obstaculos,
    ]
    modaCenter.leftBottom = {
      x: setorAzul.leftBottom.x,
      y: setorAzul.leftBottom.y,
    }
    modaCenter.topRight = {
      x: setorBranco.topRight.x,
      y: setorBranco.topRight.y,
    }
    modaCenter.setoresBounds = [
      {
        cor: setorAzul.cor,
        bounds: {
          leftBottom: setorAzul.leftBottom,
          topRight: setorAzul.topRight,
        },
      },
      {
        cor: setorLaranja.cor,
        bounds: {
          leftBottom: setorLaranja.leftBottom,
          topRight: setorLaranja.topRight,
        },
      },
      {
        cor: setorVermelho.cor,
        bounds: {
          leftBottom: setorVermelho.leftBottom,
          topRight: setorVermelho.topRight,
        },
      },
      {
        cor: setorVerde.cor,
        bounds: {
          leftBottom: setorVerde.leftBottom,
          topRight: setorVerde.topRight,
        },
      },
      {
        cor: setorAmarelo.cor,
        bounds: {
          leftBottom: setorAmarelo.leftBottom,
          topRight: setorAmarelo.topRight,
        },
      },
      {
        cor: setorBranco.cor,
        bounds: {
          leftBottom: setorBranco.leftBottom,
          topRight: setorBranco.topRight,
        },
      },
    ]
    return modaCenter
  }
}
