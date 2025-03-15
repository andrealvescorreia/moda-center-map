import { Sequelize } from 'sequelize-typescript'

const mockedSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  models: [`${__dirname}/../src/database/models`],
  logging: false,
})
;async () => await mockedSequelize.sync({ force: true })

export default mockedSequelize
