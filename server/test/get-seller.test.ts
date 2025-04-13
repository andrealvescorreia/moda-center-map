const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import app from '../src/app'
import sequelize from '../src/database'
import ProductCategory from '../src/database/models/product-category'

describe('get sellers', () => {
  let authHeader: { [key: string]: string | string[] }

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

    const response = await request(app)
      .post('/seller')
      .set('Cookie', authHeader['set-cookie'])
      .send({
        name: 'Minha loja',
        phone_number: '83999999999',
        sellingLocations: {
          boxes: [
            { street_letter: 'P', sector_color: 'orange', box_number: 120 },
            { street_letter: 'A', sector_color: 'blue', box_number: 2 },
          ],
          stores: [
            { sector_color: 'blue', block_number: 1, store_number: 1 },
            { sector_color: 'yellow', block_number: 5, store_number: 16 },
          ],
        },
        productCategories: ['Roupas', 'Calçados'],
      })
    response.status.should.be.equal(201)
  })

  it('should return all sellers', async () => {
    const response = await request(app).get('/seller')
    response.status.should.be.equal(200)
    response.body.should.be.a('array')
    response.body.length.should.be.equal(1)
    response.body[0].boxes.length.should.be.equal(2)
    response.body[0].stores.length.should.be.equal(2)
    response.body[0].product_categories.length.should.be.equal(2)
  })

  it('should return seller by boxe', async () => {
    const response = await request(app).get(
      '/seller/boxe?sector_color=orange&street_letter=P&box_number=120'
    )
    response.status.should.be.equal(200)
    response.body.boxes.length.should.be.equal(2)
    response.body.stores.length.should.be.equal(2)
    response.body.product_categories.length.should.be.equal(2)
  })

  it('should return seller by store', async () => {
    const response = await request(app).get(
      '/seller/store?sector_color=blue&block_number=1&store_number=1'
    )
    response.status.should.be.equal(200)
    response.body.boxes.length.should.be.equal(2)
    response.body.stores.length.should.be.equal(2)
    response.body.product_categories.length.should.be.equal(2)
  })
  it('should not return seller when store has no owner', async () => {
    const response = await request(app).get(
      '/seller/store?sector_color=white&block_number=1&store_number=5'
    )
    response.status.should.be.equal(404)
  })

  it('should not return seller when boxe has no owner', async () => {
    const response = await request(app).get(
      '/seller/boxe?sector_color=red&street_letter=K&box_number=112'
    )
    response.status.should.be.equal(404)
  })
})
