const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import app from '../src/app'
import User from '../src/database/models/user'
import mockedSequelize from './mock-database'

describe('user tests', () => {
  before(async () => {
    await mockedSequelize.sync({ force: true })
  })

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/user').send({
      username: 'JohnDoe',
      password: '123456',
    })
    response.status.should.be.equal(201)
    response.headers['set-cookie'].should.satisfy((cookies: string[]) =>
      cookies.some((cookie) => cookie.includes('authtoken'))
    )
    await User.findOne({ where: { username: 'JohnDoe' } }).then((user) => {
      user?.should.not.be.null
      user?.username.should.be.equal('JohnDoe')
      user?.password_hash.should.not.be.equal('123456')
      user?.passwordIsCorrect('123456').then((result) => {
        result.should.be.equal(true)
      })
    })
  })

  it('should not be able to create a user with username already taken', async () => {
    const response = await request(app).post('/user').send({
      username: 'JohnDoe',
      password: '123456',
    })
    response.status.should.be.equal(400)
    await User.findAll({ where: { username: 'JohnDoe' } }).then((users) => {
      users.length.should.be.equal(1)
    })
  })

  it('should not be able to create a user with 5 characters password', async () => {
    const response = await request(app).post('/user').send({
      username: 'maria',
      password: '12345',
    })
    response.status.should.be.equal(400)
    await User.findOne({ where: { username: 'maria' } }).then((user) => {
      should.not.exist(user)
    })
  })
})
