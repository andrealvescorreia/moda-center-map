const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import type { Includeable } from 'sequelize'
import app from '../src/app'
import sequelize from '../src/database'
import Boxe from '../src/database/models/boxe'
import ProductCategory from '../src/database/models/product-category'
import Seller from '../src/database/models/seller'

describe('create seller', () => {
  let authHeader: { [key: string]: string | string[] }

  const postSeller = async (
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    reqBody: Object,
    token = authHeader['set-cookie']
  ) => {
    const response = await request(app)
      .post('/seller')
      .set('Cookie', token ? [...token] : [])
      .send(reqBody)
    return response
  }

  const findSeller = async (name: string, include: Includeable[] = []) => {
    return await Seller.findOne({ where: { name }, include })
  }

  before(async () => {
    await sequelize.sync({ force: true })
    await request(app)
      .post('/user')
      .send({ username: 'test', password: 'test123' })
    const { header } = await request(app)
      .post('/auth')
      .send({ username: 'test', password: 'test123' })
    authHeader = header

    await ProductCategory.bulkCreate([
      { category: 'Roupas' },
      { category: 'Calçados' },
      { category: 'Acessórios' },
      { category: 'Moda Íntima' },
      { category: 'Evangélica' },
    ])
  })

  it('should be able to create a seller with one box', async () => {
    const reqBody = {
      name: 'Olivia Palito moda feminina',
      sellingLocations: {
        boxes: [{ sector_color: 'blue', box_number: 1, street_letter: 'A' }],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(201)

    const seller = await findSeller(reqBody.name, [Boxe])
    seller?.should.not.be.null
    seller?.boxes.length.should.be.equal(1)
    seller?.boxes[0].dataValues.should.include(
      reqBody.sellingLocations.boxes[0]
    )
    should.not.exist(seller?.phone_number)
    should.not.exist(seller?.product_categories)
  })

  it('should not be able to create a seller with an already occupied box', async () => {
    const reqBody = {
      name: 'Outra Olivia Palito',
      sellingLocations: {
        boxes: [{ sector_color: 'blue', box_number: 1, street_letter: 'A' }],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(400)
    response.body.errors[0].should.deep.include({
      code: 'LOCATION_OCCUPIED',
      field: 'sellingLocations.boxes',
      message: 'Box already occupied by other seller',
    })
    response.body.errors[0].occupiedBy.should.deep.include({
      name: 'Olivia Palito moda feminina',
    })

    const seller = await findSeller(reqBody.name)
    seller?.should.be.null
  })

  it('should be able to create a seller with product categories', async () => {
    const reqBody = {
      name: 'Adagio moda feminina',
      sellingLocations: {
        boxes: [{ sector_color: 'white', box_number: 128, street_letter: 'P' }],
      },
      productCategories: ['Roupas', 'Moda Íntima'],
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(201)

    const seller = await findSeller(reqBody.name, [ProductCategory])
    seller?.should.not.be.null
    seller?.product_categories.length.should.be.equal(2)
    seller?.product_categories[0].category.should.be.equal('Roupas')
    seller?.product_categories[1].category.should.be.equal('Moda Íntima')
  })

  it('should not be able to create a seller with invalid product category', async () => {
    const reqBody = {
      name: 'King Kong moda masculina',
      sellingLocations: {
        boxes: [{ sector_color: 'green', box_number: 1, street_letter: 'A' }],
      },
      productCategories: ['Automóveis', 'Moda Íntima'],
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: 'INVALID',
          field: 'productCategories',
          message: 'Product category "Automóveis" does not exist',
        },
      ],
    })

    const seller = await findSeller(reqBody.name)
    seller?.should.be.null
  })

  it('should not be able to create a seller when not authenticated', async () => {
    const reqBody = {
      name: 'Olivia Palito ',
      sellingLocations: {
        boxes: [{ sector_color: 'blue', box_number: 120, street_letter: 'P' }],
      },
    }

    const response = await postSeller(reqBody, [])
    response.status.should.be.equal(401)
    response.body.should.be.deep.equal({
      errors: [{ message: 'Login required' }],
    })

    const seller = await findSeller(reqBody.name)
    seller?.should.be.null
  })

  it('should not be able to create a seller when token is invalid', async () => {
    const reqBody = {
      name: 'Olivia Palito ',
      sellingLocations: {
        boxes: [{ sector_color: 'blue', box_number: 120, street_letter: 'P' }],
      },
    }

    const response = await postSeller(reqBody, ['authtoken=invalidtoken'])
    response.status.should.be.equal(401)
    response.body.should.be.deep.equal({
      errors: [{ message: 'Token expired or invalid' }],
    })

    const seller = await findSeller(reqBody.name)
    seller?.should.be.null
  })

  it('should not be able to create a seller when selling location is invalid', async () => {
    const reqBody = {
      name: 'Olivia Palito',
      sellingLocations: {
        boxes: [{ sector_color: 'rosinha', box_number: 0, street_letter: 'Z' }],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: 'INVALID',
          message:
            "Invalid enum value. Expected 'blue' | 'orange' | 'red' | 'green' | 'yellow' | 'white', received 'rosinha'",
          field: 'sellingLocations.boxes.0.sector_color',
        },
        {
          code: 'TOO_SHORT',
          message: 'Number must be greater than 0',
          field: 'sellingLocations.boxes.0.box_number',
        },
        {
          code: 'INVALID',
          message: 'Invalid',
          field: 'sellingLocations.boxes.0.street_letter',
        },
      ],
    })

    const seller = await findSeller(reqBody.name)
    seller?.should.be.null
  })

  it('should not be able to create a seller when selling location is invalid -> inside food court blue sector', async () => {
    const reqBody = {
      name: 'Desejo de Mulher',
      sellingLocations: {
        boxes: [{ sector_color: 'blue', box_number: 110, street_letter: 'B' }],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: 'INVALID',
          field: 'sellingLocations.boxes.0',
          message:
            'This box cannot exist inside Moda Center, otherwise it would overlap with food court',
        },
      ],
    })
    const seller = await findSeller(reqBody.name)
    seller?.should.be.null
  })

  it('should not be able to create a seller when selling location is invalid -> inside block 9 blue sector', async () => {
    const reqBody = {
      name: 'Desejo de Mulher',
      sellingLocations: {
        boxes: [{ sector_color: 'blue', box_number: 33, street_letter: 'G' }],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: 'INVALID',
          field: 'sellingLocations.boxes.0',
          message:
            'This box cannot exist inside Moda Center, otherwise it would overlap with stores',
        },
      ],
    })
    const seller = await findSeller(reqBody.name)
    seller?.should.be.null
  })

  it('should not be able to create a seller when selling location is invalid -> number 121 blue sector', async () => {
    const reqBody = {
      name: 'Desejo de Mulher',
      sellingLocations: {
        boxes: [{ sector_color: 'blue', box_number: 121, street_letter: 'P' }],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: 'TOO_BIG',
          field: 'sellingLocations.boxes.0.box_number',
          message:
            'Box number must be less than 121 for blue, orange, red, and green sectors',
        },
      ],
    })
    const seller = await findSeller(reqBody.name)
    seller?.should.be.null
  })

  it('should not be able to create a seller when selling location is invalid -> number 129 yellow sector', async () => {
    const reqBody = {
      name: 'Desejo de Mulher',
      sellingLocations: {
        boxes: [
          { sector_color: 'yellow', box_number: 129, street_letter: 'P' },
        ],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: 'TOO_BIG',
          field: 'sellingLocations.boxes.0.box_number',
          message: 'Number must be less than or equal to 128',
        },
      ],
    })
    const seller = await findSeller(reqBody.name)
    seller?.should.be.null
  })

  it('should not be able to create a seller when name already in use', async () => {
    const reqBody = {
      name: 'Olivia Palito moda feminina',
      sellingLocations: {
        boxes: [
          { sector_color: 'yellow', box_number: 121, street_letter: 'P' },
        ],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: 'ALREADY_IN_USE',
          field: 'name',
          message: 'Seller with this name already exists',
        },
      ],
    })
  })

  it('should not be able to create a seller whith invalid store -> block_number 10 and store_number 20', async () => {
    const reqBody = {
      name: 'Teste',
      sellingLocations: {
        stores: [{ block_number: 10, store_number: 20, sector_color: 'blue' }],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(400)
    response.body.should.be.deep.include({
      errors: [
        {
          code: 'TOO_BIG',
          field: 'sellingLocations.stores.0.store_number',
          message: 'Number must be less than or equal to 19',
        },
        {
          code: 'TOO_BIG',
          field: 'sellingLocations.stores.0.block_number',
          message: 'Number must be less than or equal to 9',
        },
      ],
    })
  })

  it('should be able to create a seller whith store store_number 15 block_number 7 blue sector', async () => {
    const reqBody = {
      name: 'Teste teste',
      sellingLocations: {
        stores: [{ block_number: 7, store_number: 15, sector_color: 'blue' }],
      },
    }

    const response = await postSeller(reqBody)
    response.status.should.be.equal(201)
  })

  it('should not be able to create a seller whith invalid store -> store_number 16 block_number 1-7 sector blue orange green red', async () => {
    const sectors = ['blue', 'orange', 'green', 'red']
    const reqsBody = sectors.map((sector) => ({
      name: 'Teste',
      sellingLocations: {
        stores: [{ block_number: 7, store_number: 16, sector_color: sector }],
      },
    }))

    for (const reqBody of reqsBody) {
      const response = await postSeller(reqBody)
      response.status.should.be.equal(400)
      response.body.should.be.deep.include({
        errors: [
          {
            code: 'TOO_BIG',
            field: 'sellingLocations.stores.0.store_number',
            message:
              'Number must be less than or equal to 15 for blocks between 1 and 7 of this sector',
          },
        ],
      })
    }
  })

  it('should not be able to create a seller whith invalid store -> store_number 15 block_number 8 sector blue and orange', async () => {
    const sectors = ['blue', 'orange']
    const reqsBody = sectors.map((sector) => ({
      name: 'Teste',
      sellingLocations: {
        stores: [{ block_number: 8, store_number: 15, sector_color: sector }],
      },
    }))

    for (const reqBody of reqsBody) {
      const response = await postSeller(reqBody)
      response.status.should.be.equal(400)
      response.body.should.be.deep.include({
        errors: [
          {
            code: 'TOO_BIG',
            field: 'sellingLocations.stores.0.store_number',
            message:
              'Number must be less than or equal to 14 for block 8 of this sector',
          },
        ],
      })
    }
  })

  it('should not be able to create a seller whith invalid store -> store_number 7 block_number 8 sector red and green', async () => {
    const sectors = ['red', 'green']
    const reqsBody = sectors.map((sector) => ({
      name: 'Teste',
      sellingLocations: {
        stores: [{ block_number: 8, store_number: 7, sector_color: sector }],
      },
    }))

    for (const reqBody of reqsBody) {
      const response = await postSeller(reqBody)
      response.status.should.be.equal(400)
      response.body.should.be.deep.include({
        errors: [
          {
            code: 'TOO_BIG',
            field: 'sellingLocations.stores.0.store_number',
            message:
              'Number must be less than or equal to 6 for block 8 of this sector',
          },
        ],
      })
    }
  })

  it('should not be able to create a seller whith invalid store -> store_number 19 block_number 1 sector yellow and white', async () => {
    const sectors = ['yellow', 'white']
    const reqsBody = sectors.map((sector) => ({
      name: 'Teste',
      sellingLocations: {
        stores: [{ block_number: 1, store_number: 19, sector_color: sector }],
      },
    }))

    for (const reqBody of reqsBody) {
      const response = await postSeller(reqBody)
      response.status.should.be.equal(400)
      response.body.should.be.deep.include({
        errors: [
          {
            code: 'TOO_BIG',
            field: 'sellingLocations.stores.0.store_number',
            message:
              'Number must be less than or equal to 18 for blocks between 1 and 4 of this sector',
          },
        ],
      })
    }
  })

  it('should be able to create a seller whith store -> store_number 19 block_number 5 sector yellow and white', async () => {
    const reqsBody = ['yellow', 'white'].map((sector) => ({
      sellingLocations: {
        stores: [{ block_number: 5, store_number: 19, sector_color: sector }],
      },
    }))

    for (let i = 0; i < reqsBody.length; i++) {
      const reqBody = { ...reqsBody[i], name: `Teste ${i}` }
      const response = await postSeller(reqBody)
      response.status.should.be.equal(201)
    }
  })

  it('should be able to create a seller whith store -> store_number 19 block_number 9 sector blue orange red green', async () => {
    const reqsBody = ['orange', 'blue', 'red', 'green'].map((sector) => ({
      sellingLocations: {
        stores: [{ block_number: 9, store_number: 19, sector_color: sector }],
      },
    }))

    for (let i = 1; i < reqsBody.length; i++) {
      const reqBody = { ...reqsBody[i], name: `Teste ${i + 10}` }
      const response = await postSeller(reqBody)
      response.status.should.be.equal(201)
    }
  })
})
