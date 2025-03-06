import type { Position } from '../../interfaces/Position'
import Obstaculo from '../Obstaculo'
import { StructureReflector } from '../StructureReflector'
import type Setor from './Setor'

export class PracaDeAlimentacaoCreator {
  #leftBottom!: Position
  #setor!: Setor['cor']
  #topRight!: Position

  setLeftBottom(leftBottom: Position) {
    this.#leftBottom = leftBottom
    return this
  }

  setSetor(setor: Setor['cor']) {
    this.#setor = setor
    return this
  }

  #calculateTopRight() {
    this.#topRight = {
      x: this.#leftBottom.x + 11,
      y: this.#leftBottom.y + 19,
    }
  }

  #createRestaurantesStructure() {
    const restaurantes: Obstaculo[] = []

    const widthRestaurante = 3
    const heightRestaurante = 2
    const qtdRestaurantes = 8

    let yOffset = 2
    for (let i = 0; i < qtdRestaurantes; i++) {
      const bottomLeftRestaurante = {
        x: this.#topRight.x - 1 - widthRestaurante,
        y: this.#leftBottom.y + (heightRestaurante - 2) + yOffset,
      }

      const topRightRestaurante = {
        x: this.#topRight.x - 1,
        y: this.#leftBottom.y + heightRestaurante + yOffset,
      }

      const gridArea = []
      for (let y = bottomLeftRestaurante.y; y < topRightRestaurante.y; y++) {
        for (let x = bottomLeftRestaurante.x; x < topRightRestaurante.x; x++) {
          gridArea.push({ x, y })
        }
      }
      const obstaculo = new Obstaculo()
      obstaculo.gridArea = gridArea
      restaurantes.push(obstaculo)
      yOffset += heightRestaurante
    }

    return restaurantes
  }

  create() {
    this.#calculateTopRight()
    const restaurantes: Obstaculo[] = this.#createRestaurantesStructure()

    let reflectorParams = {
      reflectX: false,
      reflectY: false,
    }

    switch (this.#setor) {
      case 'Laranja':
        reflectorParams = {
          reflectX: true,
          reflectY: false,
        }
        break
      case 'Vermelho':
        reflectorParams = {
          reflectX: false,
          reflectY: true,
        }
        break
      case 'Verde':
        reflectorParams = {
          reflectX: true,
          reflectY: true,
        }
        break
      case 'Amarelo':
        reflectorParams = {
          reflectX: false,
          reflectY: true,
        }
        break
      case 'Branco':
        reflectorParams = {
          reflectX: true,
          reflectY: true,
        }
        break
    }

    const reflector = new StructureReflector().setObjs(restaurantes).setBounds({
      bottomLeft: this.#leftBottom,
      topRight: this.#topRight,
    })
    reflector.reflect(reflectorParams)

    return {
      restaurantes,
      leftBottom: this.#leftBottom,
      topRight: this.#topRight,
    }
  }
}
