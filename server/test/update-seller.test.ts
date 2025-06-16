const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import app from '../src/app'
import sequelize, { setup } from '../src/database'
import Boxe from '../src/database/models/boxe'
import ProductCategory from '../src/database/models/product-category'
import Seller from '../src/database/models/seller'
import Store from '../src/database/models/store'

describe('update seller', () => {
  let authHeader: { [key: string]: string | string[] }

  const setupAuth = async () => {
    await request(app)
      .post('/user')
      .send({ username: 'test', password: 'test123' })
    const { header } = await request(app)
      .post('/auth')
      .send({ username: 'test', password: 'test123' })
    authHeader = header
  }

  const setupProductCategories = async () => {
    await ProductCategory.bulkCreate([
      { category: 'Jeans' },
      { category: 'Calçados' },
      { category: 'Acessórios' },
      { category: 'Moda Íntima' },
      { category: 'Evangélica' },
    ])
  }

  const setupSellers = async () => {
    const requests = [
      {
        name: 'Olivia Palito moda feminina',
        phone_number: '8399442242',
        sellingLocations: {
          boxes: [
            { sector_color: 'blue', box_number: 2, street_letter: 'A' },
            { sector_color: 'blue', box_number: 4, street_letter: 'A' },
          ],
        },
      },
      {
        name: 'Lobo Manso',
        sellingLocations: {
          boxes: [{ sector_color: 'red', box_number: 3, street_letter: 'B' }],
        },
      },
      {
        name: 'Balango Tango',
        sellingLocations: {
          boxes: [{ sector_color: 'red', box_number: 4, street_letter: 'B' }],
          stores: [{ block_number: 7, store_number: 15, sector_color: 'blue' }],
        },
        product_categories: ['Jeans', 'Calçados', 'Acessórios'],
      },
    ]
    for (const req of requests) {
      const response = await postSeller(req)
      if (response.status !== 201) {
        throw new Error(
          `Failed to create seller: ${JSON.stringify(response, null, 2)}`
        )
      }
    }
  }

  before(async () => {
    await setup()
    await sequelize.sync({ force: true })
    await setupAuth()
    await setupProductCategories()
  })

  beforeEach(async () => {
    // Limpa os dados antes de cada teste
    await Seller.destroy({ where: {}, force: true })
    await Boxe.destroy({ where: {}, force: true })
    await Store.destroy({ where: {}, force: true })
    await setupSellers()
  })

  const postSeller = async (
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    reqBody: Object,
    token = authHeader['set-cookie']
  ) =>
    await request(app)
      .post('/seller')
      .set('Cookie', token ? [...token] : [])
      .send(reqBody)

  const updateSeller = async (
    id: string | undefined,
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    reqBody: Object,
    token = authHeader['set-cookie']
  ) =>
    await request(app)
      .put(`/seller/id/${id}`)
      .set('Cookie', token ? [...token] : [])
      .send(reqBody)

  const findSellerByName = async (name: string) =>
    await Seller.findOne({ where: { name } })

  it('should not update seller if no changes are made', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')
    const sellerId = seller?.id

    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const res = await updateSeller(sellerId, original)
    res.status.should.equal(200)

    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated?.should.deep.equal(original)
  })

  it('should return 404 if seller does not exist', async () => {
    const res = await updateSeller('3fa85f64-5717-4562-b3fc-2c963f66afa6', {
      name: 'New Seller Name',
      phone_number: '8399999999',
      boxes: [{ sector_color: 'blue', box_number: 2, street_letter: 'A' }],
    })
    res.status.should.equal(404)
    res.body.should.have.property('message')
    res.body.message.should.equal('Seller not found')
  })

  it('should be able to update seller name', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id

    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = { ...original, name: 'Maria Chiquinha' }
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(200)

    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.should.deep.equal(updatedBody)
  })
  it('should be able to update seller phone', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id

    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = { ...original, phone_number: '8399887766' }
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(200)

    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.should.deep.equal(updatedBody)
  })

  it('should be able to remove seller phone', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id

    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = { ...original, phone_number: null }
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(200)

    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.should.deep.equal(updatedBody)
  })

  it('should not be able to update seller to a name already taken', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id

    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = { ...original, name: 'Lobo Manso' }
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(400)
    res.body.should.be.deep.equal({
      errors: [
        {
          code: 'ALREADY_IN_USE',
          field: 'name',
          message: 'Seller with this name already exists',
        },
      ],
    })

    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.should.not.deep.equal(updatedBody)
  })

  it('should not be able to update seller to a name with less than 3 characters', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id

    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = { ...original, name: 'Oi' }
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(400)

    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.should.not.deep.equal(updatedBody)
  })

  it('should be able to add a boxe to a seller', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id
    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.boxes.push({
      sector_color: 'orange',
      box_number: 5,
      street_letter: 'A',
    })
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(200)
    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.boxes.length.should.equal(original.boxes.length + 1)
  })

  it('should be able to remove a boxe from a seller', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id

    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.boxes.pop()

    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(200)

    const boxe = await Boxe.findOne({
      where: {
        sector_color: original.boxes[1].sector_color,
        box_number: original.boxes[1].box_number,
        street_letter: original.boxes[1].street_letter,
      },
    })
    should.not.exist(boxe)

    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.boxes.length.should.equal(original.boxes.length - 1)
  })

  it('should be able add a boxe that was removed from another seller', async () => {
    const seller1 = await findSellerByName('Olivia Palito moda feminina')

    const { body: seller1Body } = await request(app).get(
      `/seller/id/${seller1?.id}`
    )
    seller1Body.boxes.pop()

    await updateSeller(seller1?.id, seller1Body)

    const seller2 = await findSellerByName('Balango Tango')

    const { body: seller2Body } = await request(app).get(
      `/seller/id/${seller2?.id}`
    )
    seller2Body.product_categories = seller2Body.product_categories.map(
      (pc: { category: string }) => pc.category
    )
    seller2Body.boxes.push({
      sector_color: 'blue',
      street_letter: 'A',
      box_number: 4,
    })
    const res = await updateSeller(seller2?.id, seller2Body)
    res.status.should.equal(200)
    const { body: updated } = await request(app).get(
      `/seller/id/${seller2?.id}`
    )
    updated.boxes.length.should.equal(seller2Body.boxes.length)
  })

  it('should be able to add a store to a seller', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id
    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.stores.push({
      sector_color: 'orange',
      store_number: 5,
      block_number: 1,
    })
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(200)
    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.stores.length.should.equal(original.stores.length + 1)
  })

  it('should be able to remove a store from a seller', async () => {
    const seller = await findSellerByName('Balango Tango')

    const sellerId = seller?.id

    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.product_categories = updatedBody.product_categories.map(
      (pc: { category: string }) => pc.category
    )
    updatedBody.stores.pop() // remove last store

    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(200)

    const store = await Store.findOne({
      where: {
        sector_color: original.stores[0].sector_color,
        block_number: original.stores[0].block_number,
        store_number: original.stores[0].store_number,
      },
    })
    should.not.exist(store)

    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.stores.length.should.equal(original.stores.length - 1)
  })

  it('should not be able to update seller if boxe is invalid', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id
    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.boxes.push({
      sector_color: 'blue',
      box_number: 1,
      street_letter: 'A',
    })
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(400)
    res.body.should.be.deep.equal({
      errors: [
        {
          code: 'INVALID',
          field: 'sellingLocations.boxes.2.box_number',
          message: 'Street letter A of sector blue must have even box number',
        },
      ],
    })
    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.boxes.length.should.equal(original.boxes.length)
  })

  it('should not be able to update seller if boxe is already taken', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id
    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.boxes.push({
      sector_color: 'red',
      street_letter: 'B',
      box_number: 3,
    })
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(400)
    res.body.errors[0].should.deep.include({
      code: 'LOCATION_OCCUPIED',
      field: 'sellingLocations.boxes',
      message: 'Box already occupied by other seller',
    })
    res.body.errors[0].occupiedBy.should.deep.include({
      name: 'Lobo Manso',
    })
    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.boxes.length.should.equal(original.boxes.length)
  })

  it('should not be able to update seller if store is invalid', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id
    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.stores.push({
      sector_color: 'blue',
      block_number: 1,
      store_number: 20,
    })
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(400)
    res.body.should.be.deep.equal({
      errors: [
        {
          code: 'TOO_BIG',
          field: 'stores.0.store_number',
          message: 'Number must be less than or equal to 19',
        },
      ],
    })
    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.stores.length.should.equal(original.stores.length)
  })

  it('should not be able to update seller if store is already taken', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')

    const sellerId = seller?.id
    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.stores.push({
      block_number: 7,
      store_number: 15,
      sector_color: 'blue',
    })
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(400)
    res.body.errors[0].should.deep.include({
      code: 'LOCATION_OCCUPIED',
      field: 'sellingLocations.stores',
      message: 'Store already occupied by other seller',
    })
    res.body.errors[0].occupiedBy.should.deep.include({
      name: 'Balango Tango',
    })
    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.stores.length.should.equal(original.stores.length)
  })

  it('should be able to add a product category to a seller', async () => {
    const seller = await findSellerByName('Balango Tango')

    const sellerId = seller?.id
    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.product_categories = updatedBody.product_categories.map(
      (pc: { category: string }) => pc.category
    )
    const updatedProdCategories = original.product_categories.map(
      (pc: { category: string }) => pc.category
    )
    updatedProdCategories.push('Evangélica')
    updatedBody.product_categories = updatedProdCategories
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(200)
    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.product_categories.length.should.equal(
      original.product_categories.length + 1
    )
  })

  it('should be able to remove a product category from a seller', async () => {
    const seller = await findSellerByName('Balango Tango')

    const sellerId = seller?.id
    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.product_categories = updatedBody.product_categories.map(
      (pc: { category: string }) => pc.category
    )
    const updatedProdCategories = original.product_categories.map(
      (pc: { category: string }) => pc.category
    )
    updatedProdCategories.pop()

    updatedBody.product_categories = updatedProdCategories
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(200)
    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.product_categories.length.should.equal(
      original.product_categories.length - 1
    )
  })

  it('should not be able to update seller if product category is invalid', async () => {
    const seller = await findSellerByName('Balango Tango')

    const sellerId = seller?.id
    const { body: original } = await request(app).get(`/seller/id/${sellerId}`)
    const updatedBody = structuredClone(original)
    updatedBody.product_categories = updatedBody.product_categories.map(
      (pc: { category: string }) => pc.category
    )
    const updatedProdCategories = original.product_categories.map(
      (pc: { category: string }) => pc.category
    )
    updatedProdCategories.push('Automóveis')

    updatedBody.product_categories = updatedProdCategories
    const res = await updateSeller(sellerId, updatedBody)
    res.status.should.equal(400)

    res.body.should.be.deep.equal({
      errors: [
        {
          code: 'INVALID',
          field: 'productCategories',
          message: 'Product category "Automóveis" does not exist',
        },
      ],
    })

    const { body: updated } = await request(app).get(`/seller/id/${sellerId}`)
    updated.product_categories.length.should.equal(
      original.product_categories.length
    )
  })
})
