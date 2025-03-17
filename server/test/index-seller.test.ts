const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import app from '../src/app'
import sequelize from '../src/database'
import Boxe from '../src/database/models/boxe'
import ProductCategory from '../src/database/models/product-category'
import Seller from '../src/database/models/seller'
import Store from '../src/database/models/store'

describe('seller tests', () => {
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
            { street_letter: 'A', sector_color: 'blue', box_number: 1 },
            { street_letter: 'P', sector_color: 'orange', box_number: 120 },
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
    console.log(JSON.stringify(response.body, null, 2))
    response.status.should.be.equal(200)
    response.body.should.be.a('array')
    response.body.length.should.be.equal(1)
    response.body[0].boxes.length.should.be.equal(2)
    response.body[0].stores.length.should.be.equal(2)
    response.body[0].product_categories.length.should.be.equal(2)
  })
})
