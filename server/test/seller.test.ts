const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import app from '../src/app'
import sequelize from '../src/database' //executes the database connection
import Boxe from '../src/database/models/boxe'
import ProductCategory from '../src/database/models/product-category'
import Seller from '../src/database/models/seller'
import Store from '../src/database/models/store'

describe('seller tests', () => {
  let authHeader: { [key: string]: string | string[] }
  before(async () => {
    await sequelize.sync({ force: true })
    await request(app).post('/user').send({
      username: 'test',
      password: 'test123',
    })
    const { header } = await request(app).post('/auth').send({
      username: 'test',
      password: 'test123',
    })
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
        boxes: [
          {
            sector_color: 'blue',
            box_number: 1,
            street_letter: 'A',
          },
        ],
      },
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(201)
    const seller = await Seller.findOne({
      where: { name: reqBody.name },
      include: [Boxe],
    })
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
        boxes: [
          {
            sector_color: 'blue',
            box_number: 1,
            street_letter: 'A',
          },
        ],
      },
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(400)
    response.body.errors[0].should.deep.include({
      code: 'LOCATION_OCCUPIED',
      field: 'sellingLocations.boxes',
      message: 'Box already occupied by other seller',
    })
    response.body.errors[0].occupiedBy.should.have.property('id')
    response.body.errors[0].occupiedBy.should.deep.include({
      name: 'Olivia Palito moda feminina',
    })

    const seller = await Seller.findOne({
      where: { name: reqBody.name },
    })
    seller?.should.be.null
  })

  it('should be able to create a seller with product categories', async () => {
    const reqBody = {
      name: 'Adagio moda feminina',
      sellingLocations: {
        boxes: [
          {
            sector_color: 'white',
            box_number: 1,
            street_letter: 'A',
          },
        ],
      },
      productCategories: ['Roupas', 'Moda Íntima'],
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(201)
    const seller = await Seller.findOne({
      where: { name: reqBody.name },
      include: [ProductCategory],
    })
    seller?.should.not.be.null
    seller?.product_categories.length.should.be.equal(2)
    seller?.product_categories[0].category.should.be.equal('Roupas')
    seller?.product_categories[1].category.should.be.equal('Moda Íntima')
  })

  it('should not be able to create a seller with invalid product category', async () => {
    const reqBody = {
      name: 'King Kong moda masculina',
      sellingLocations: {
        boxes: [
          {
            sector_color: 'green',
            box_number: 1,
            street_letter: 'A',
          },
        ],
      },
      productCategories: ['Automóveis', 'Moda Íntima'],
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: 'INVALID',
          field: 'productCategories',
          message: 'Product category "Automóveis" is invalid',
        },
      ],
    })
    const seller = await Seller.findOne({
      where: { name: reqBody.name },
    })
    seller?.should.be.null
  })

  it('should be able to create a seller with one store', async () => {
    const reqBody = {
      name: 'Popeye moda masculina',
      sellingLocations: {
        stores: [
          {
            sector_color: 'blue',
            store_number: 1,
            block_number: 1,
          },
        ],
      },
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(201)
    const seller = await Seller.findOne({
      where: { name: reqBody.name },
      include: [Store],
    })
    seller?.should.not.be.null
    seller?.stores.length.should.be.equal(1)
    seller?.stores[0].dataValues.should.include(
      reqBody.sellingLocations.stores[0]
    )
  })

  it('should not be able to create a seller with an already occupied store', async () => {
    const reqBody = {
      name: 'Outro Popeye',
      sellingLocations: {
        stores: [
          {
            sector_color: 'blue',
            block_number: 1,
            store_number: 1,
          },
        ],
      },
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(400)
    response.body.errors[0].should.deep.include({
      code: 'LOCATION_OCCUPIED',
      field: 'sellingLocations.stores',
      message: 'Store already occupied by other seller',
    })
    response.body.errors[0].occupiedBy.should.have.property('id')
    response.body.errors[0].occupiedBy.should.deep.include({
      name: 'Popeye moda masculina',
    })

    const seller = await Seller.findOne({
      where: { name: reqBody.name },
    })
    seller?.should.be.null
  })

  it('should be able to create a seller with boxes and stores', async () => {
    const reqBody = {
      name: 'Lobo feroz',
      sellingLocations: {
        boxes: [
          {
            sector_color: 'blue',
            box_number: 2,
            street_letter: 'A',
          },
          {
            sector_color: 'blue',
            box_number: 3,
            street_letter: 'A',
          },
          {
            sector_color: 'blue',
            box_number: 4,
            street_letter: 'A',
          },
        ],
        stores: [
          {
            sector_color: 'blue',
            store_number: 1,
            block_number: 2,
          },
          {
            sector_color: 'blue',
            store_number: 2,
            block_number: 2,
          },
        ],
      },
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(201)
    const seller = await Seller.findOne({
      where: { name: reqBody.name },
      include: [Boxe, Store],
    })
    seller?.should.not.be.null
    seller?.boxes.length.should.be.equal(3)
    seller?.stores.length.should.be.equal(2)
  })

  it('should be able to create a seller with valid phone number', async () => {
    const reqBody = {
      name: 'Lobo do mato',
      phone_number: '(83)99888-7766',
      sellingLocations: {
        stores: [
          {
            sector_color: 'orange',
            store_number: 1,
            block_number: 1,
          },
        ],
      },
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(201)
    const seller = await Seller.findOne({
      where: { name: reqBody.name },
      include: [Store],
    })
    seller?.should.not.be.null
    seller?.phone_number.should.be.equal('83998887766')
  })

  it('should not be able to create a seller without selling location', async () => {
    const reqBody = {
      name: 'Popeye moda',
      sellingLocations: {
        stores: [],
        boxs: [],
      },
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(400)

    response.body.should.be.deep.equal({
      errors: [
        {
          error: 'MISSING_SELLING_LOCATION',
          field: 'sellingLocations',
          message: 'A seller must have at least one selling location',
        },
      ],
    })

    const seller = await Seller.findOne({
      where: { name: reqBody.name },
    })
    seller?.should.be.null
  })

  it('should not be able to create a seller with invalid phone number', async () => {
    const reqBody = {
      name: 'Ditongo',
      phone_number: '12345678',
      sellingLocations: {
        stores: [
          {
            sector_color: 'orange',
            store_number: 8,
            block_number: 1,
          },
        ],
      },
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', [...authHeader['set-cookie']])
      .send(reqBody)

    response.status.should.be.equal(400)

    response.body.should.be.deep.equal({
      errors: [
        {
          code: 'TOO_SHORT',
          field: 'phone_number',
          message: 'String must contain at least 10 character(s)',
        },
      ],
    })

    const seller = await Seller.findOne({
      where: { name: reqBody.name },
    })
    seller?.should.be.null
  })

  it('should not be able to create a seller when not authenticated', async () => {
    const reqBody = {
      name: 'Olivia Palito ',
      sellingLocations: {
        boxes: [
          {
            sector_color: 'blue',
            box_number: 120,
            street_letter: 'P',
          },
        ],
      },
    }

    const response = await request(app).post('/seller').send(reqBody)

    response.status.should.be.equal(401)
    response.body.should.be.deep.equal({
      errors: [
        {
          message: 'Login required',
        },
      ],
    })

    const seller = await Seller.findOne({
      where: { name: reqBody.name },
    })
    seller?.should.be.null
  })

  it('should not be able to create a seller when token is invalid', async () => {
    const reqBody = {
      name: 'Olivia Palito ',
      sellingLocations: {
        boxes: [
          {
            sector_color: 'blue',
            box_number: 120,
            street_letter: 'P',
          },
        ],
      },
    }

    const response = await request(app)
      .post('/seller')
      .set('Cookie', ['authtoken=invalidtoken'])
      .send(reqBody)

    response.status.should.be.equal(401)
    response.body.should.be.deep.equal({
      errors: [
        {
          message: 'Token expired or invalid',
        },
      ],
    })

    const seller = await Seller.findOne({
      where: { name: reqBody.name },
    })
    seller?.should.be.null
  })

  //TODO:

  // teste com boxe invalido -> box_number = 0 || box_number > 128
  // teste valido setor amarelo e branco box_number > 120 && box_number < 129
  // teste invalido setor azul, vermelho, laranja e verde box_number > 120
  // teste loja invalida ->

  //
})
