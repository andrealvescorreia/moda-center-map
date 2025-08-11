const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import app from '../src/app'
import sequelize, { setupDatabase } from '../src/database'
import Boxe from '../src/database/models/boxe'
import ProductCategory from '../src/database/models/product-category'
import Seller from '../src/database/models/seller'
import SellerProductCategories from '../src/database/models/seller-product-categories'
import Store from '../src/database/models/store'

describe('delete seller', () => {
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

  before(async () => {
    await setupDatabase()
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

  it('should be able to delete a seller', async () => {
    const reqBody = {
      name: 'Olivia Palito moda feminina',
      sellingLocations: {
        boxes: [{ sector_color: 'blue', box_number: 2, street_letter: 'A' }],
        stores: [{ sector_color: 'blue', store_number: 1, block_number: 1 }],
      },
      phone_number: '31999999999',
      productCategories: ['Roupas', 'Calçados'],
    }
    const response = await postSeller(reqBody)

    const deleteResponse = await request(app)
      .delete(`/seller/id/${response.body.id}`)
      .set('Cookie', authHeader['set-cookie'])

    deleteResponse.status.should.be.equal(204)
    const sellers = await Seller.findAll()
    sellers.length.should.be.equal(0)
    const boxes = await Boxe.findAll()
    boxes.length.should.be.equal(0)
    const lojas = await Store.findAll()
    lojas.length.should.be.equal(0)

    const sellerProductCategories = await SellerProductCategories.findAll()
    sellerProductCategories.length.should.be.equal(0)
  })
  it('should return 404 when trying to delete a seller with a non-existent id', async () => {
    const nonExistentId = '1e68649f-30f5-401f-91d1-147e3820348a'
    const deleteResponse = await request(app)
      .delete(`/seller/id/${nonExistentId}`)
      .set('Cookie', authHeader['set-cookie'])

    deleteResponse.status.should.be.equal(404)
    deleteResponse.body.should.have.property('errors')
  })

  it('should not delete other sellers when deleting one seller', async () => {
    // Create two sellers
    const seller1 = await postSeller({
      name: 'Seller One',
      sellingLocations: {
        boxes: [{ sector_color: 'red', box_number: 3, street_letter: 'B' }],
        stores: [{ sector_color: 'red', store_number: 2, block_number: 2 }],
      },
      phone_number: '31988888888',
      productCategories: ['Acessórios'],
    })
    const seller2 = await postSeller({
      name: 'Seller Two',
      sellingLocations: {
        boxes: [{ sector_color: 'green', box_number: 4, street_letter: 'C' }],
        stores: [{ sector_color: 'green', store_number: 3, block_number: 3 }],
      },
      phone_number: '31977777777',
      productCategories: ['Moda Íntima'],
    })

    // Delete seller1
    const deleteResponse = await request(app)
      .delete(`/seller/id/${seller1.body.id}`)
      .set('Cookie', authHeader['set-cookie'])
    deleteResponse.status.should.be.equal(204)

    // seller2 should still exist
    const sellers = await Seller.findAll()
    sellers.length.should.be.equal(1)
    sellers[0].name.should.be.equal('Seller Two')
  })
})
