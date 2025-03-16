const chai = require('chai')
const request = require('supertest')
const should = chai.should()
import errorsId from '../../shared/operation-errors'
import app from '../src/app'
import sequelize from '../src/database' //executes the database connection
import User from '../src/database/models/user'

describe('user tests', () => {
  before(async () => {
    await sequelize.sync({ force: true })
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

    response.body.should.be.deep.equal({
      errors: [
        {
          code: errorsId.ALREADY_IN_USE,
          field: 'username',
          message: 'Username already taken',
        },
      ],
    })

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
    response.body.should.be.deep.equal({
      errors: [
        {
          code: errorsId.TOO_SHORT,
          field: 'password',
          message: 'String must contain at least 6 character(s)',
        },
      ],
    })

    await User.findOne({ where: { username: 'maria' } }).then((user) => {
      should.not.exist(user)
    })
  })

  it('should not be able to create a user with 51 characters password', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        username: 'maria',
        password: '1'.repeat(51),
      })
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: errorsId.TOO_BIG,
          field: 'password',
          message: 'String must contain at most 50 character(s)',
        },
      ],
    })

    await User.findOne({ where: { username: 'maria' } }).then((user) => {
      should.not.exist(user)
    })
  })

  it('should not be able to create a user with 2 characters username', async () => {
    const response = await request(app).post('/user').send({
      username: 'ma',
      password: '123456',
    })
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: errorsId.TOO_SHORT,
          field: 'username',
          message: 'String must contain at least 3 character(s)',
        },
      ],
    })

    await User.findOne({ where: { username: 'ma' } }).then((user) => {
      should.not.exist(user)
    })
  })

  it('should not be able to create a user with 256 characters username', async () => {
    const username = 'm'.repeat(256)
    const response = await request(app).post('/user').send({
      username,
      password: '123456',
    })
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: errorsId.TOO_BIG,
          field: 'username',
          message: 'String must contain at most 255 character(s)',
        },
      ],
    })

    await User.findOne({ where: { username } }).then((user) => {
      should.not.exist(user)
    })
  })

  it('should not be able to create a user with missing required fields', async () => {
    const response = await request(app).post('/user').send({})
    response.status.should.be.equal(400)
    response.body.should.be.deep.equal({
      errors: [
        {
          code: errorsId.INVALID,
          field: 'username',
          message: 'Required',
        },
        {
          code: errorsId.INVALID,
          field: 'password',
          message: 'Required',
        },
      ],
    })
  })
})
