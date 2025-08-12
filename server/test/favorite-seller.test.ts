const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import app from '../src/app'
import sequelize, { setupDatabase } from '../src/database'
import ProductCategory from '../src/database/models/product-category'

import UserFavoriteSellers from '../src/database/models/user-favorite-sellers'

describe('favorite seller', () => {
  let authHeader: { [key: string]: string | string[] }
  let userId: string
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
    const registerRes = await request(app)
      .post('/user')
      .send({ username: 'test', password: 'test123' })
    userId = registerRes.body.id
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

  it('should be able to favorite a seller', async () => {
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
    const favoriteResponse = await request(app)
      .post(`/seller/favorite/${response.body.id}`)
      .set('Cookie', authHeader['set-cookie'])

    favoriteResponse.status.should.be.equal(200)

    const userFavoreite = await UserFavoriteSellers.findAll({
      where: { user_id: userId },
    })
    userFavoreite.length.should.be.equal(1)
  })

  it('should be able to get user favorite sellers', async () => {
    const sellersResponse = await request(app)
      .get('/seller/favorite')
      .set('Cookie', authHeader['set-cookie'])
    sellersResponse.status.should.be.equal(200)
    sellersResponse.body[0].name.should.be.equal('Olivia Palito moda feminina')
    sellersResponse.body.length.should.be.equal(1)
  })

  it('should return true when get if seller is favorite', async () => {
    const sellersResponse = await request(app)
      .get('/seller/favorite')
      .set('Cookie', authHeader['set-cookie'])
    const seller_id = sellersResponse.body[0].id

    const isFavoriteResponse = await request(app)
      .get(`/seller/favorite/${seller_id}`)

      .set('Cookie', authHeader['set-cookie'])
    isFavoriteResponse.status.should.be.equal(200)
    isFavoriteResponse.body.isFavorite.should.be.equal(true)
  })

  it('should be able to unfavorite a seller', async () => {
    const sellersResponse = await request(app)
      .get('/seller/favorite')
      .set('Cookie', authHeader['set-cookie'])
    const seller_id = sellersResponse.body[0].id

    const unfavoriteResponse = await request(app)
      .delete(`/seller/favorite/${seller_id}`)
      .set('Cookie', authHeader['set-cookie'])

    unfavoriteResponse.status.should.be.equal(200)

    const userFavoreite = await UserFavoriteSellers.findAll({
      where: { user_id: userId },
    })
    userFavoreite.length.should.be.equal(0)
  })
})
