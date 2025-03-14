// .js excluisivo para o sequelize-cli que não suporta typescript (to começando a me questionar se o sequelize foi uma boa escolha 😐)
module.exports = {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  models: [`${__dirname}/../models`],
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  //dialectOptions: {},
  timezone: 'America/Sao_Paulo',
}
