const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import app from '../src/app'
import sequelize, { setupDatabase } from '../src/database'
import Notes from '../src/database/models/note'
import Seller from '../src/database/models/seller'

describe('seller note', () => {
  let authHeader: { [key: string]: string | string[] }
  const postSeller = async (
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    reqBody: Object,
    token = authHeader['set-cookie']
  ) =>
    await request(app)
      .post('/seller')
      .set('Cookie', token ? [...token] : [])
      .send(reqBody)

  const setupAuth = async () => {
    await request(app)
      .post('/user')
      .send({ username: 'user1', password: 'test123' })
    const { header } = await request(app)
      .post('/auth')
      .send({ username: 'user1', password: 'test123' })
    authHeader = header
  }
  const setupSellers = async () => {
    const requests = [
      {
        name: 'Olivia Palito moda feminina',
        phone_number: '8399442242',
        sellingLocations: {
          boxes: [{ sector_color: 'blue', box_number: 2, street_letter: 'A' }],
        },
      },
      {
        name: 'Lobo Manso',
        sellingLocations: {
          boxes: [{ sector_color: 'red', box_number: 3, street_letter: 'B' }],
        },
      },
    ]
    for (const req of requests) {
      await postSeller(req)
    }
  }

  before(async () => {
    await setupDatabase()
    await sequelize.sync({ force: true })
    await setupAuth()
    await setupSellers()
  })

  const findSellerByName = async (name: string) =>
    await Seller.findOne({ where: { name } })

  it('should create a note for a seller', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')
    const text = 'This is a test note\n hello friend.'
    const response = await request(app)
      .put(`/seller/id/${seller?.id}/note`)
      .set('Cookie', authHeader['set-cookie'])
      .send({ text })
    response.status.should.equal(200)
    response.body.should.have.property('id')
    response.body.should.have.property('text')
    response.body.text.should.equal(text)

    // Verifica se a nota foi realmente criada no bd
    const note = await Notes.findOne({ where: { id: response.body.id } })
    should.exist(note)
    note?.text.should.equal(text)
  })

  it('should edit a note for a seller', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')
    const text = 'Note has been changed'
    const response = await request(app)
      .put(`/seller/id/${seller?.id}/note`)
      .set('Cookie', authHeader['set-cookie'])
      .send({ text })
    response.status.should.equal(200)
    response.body.should.have.property('id')
    response.body.should.have.property('text')
    response.body.text.should.equal(text)
  })

  it('should get seller note', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')
    const response = await request(app)
      .get(`/seller/id/${seller?.id}/note`)
      .set('Cookie', authHeader['set-cookie'])
    response.status.should.equal(200)
    response.body.should.have.property('id')
    response.body.should.have.property('text')
    response.body.text.should.equal('Note has been changed')
  })

  it('should edit a note for a seller when text is empty', async () => {
    const seller = await findSellerByName('Olivia Palito moda feminina')
    const text = ''
    const response = await request(app)
      .put(`/seller/id/${seller?.id}/note`)
      .set('Cookie', authHeader['set-cookie'])
      .send({ text })
    response.status.should.equal(200)
    response.body.should.have.property('id')
    response.body.should.have.property('text')
    response.body.text.should.equal(text)
  })

  it('should return 404 if user have not added note to seller', async () => {
    const seller = await findSellerByName('Lobo Manso')
    const response = await request(app)
      .get(`/seller/id/${seller?.id}/note`)
      .set('Cookie', authHeader['set-cookie'])
    response.status.should.equal(404)
  })

  // teste diferente usuario adiciona nota para mesmo vendedor. Cada usuario deve ter sua propria nota
})
