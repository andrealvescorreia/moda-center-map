import { Sequelize } from 'sequelize-typescript'
import databaseConfig from '../config/database'
import Boxe from './models/boxe'
import ProductCategory from './models/product-category'
import Seller from './models/seller'
import SellerProductCategories from './models/seller-product-categories'
import Store from './models/store'
import User from './models/user'
import UserFavoriteSellers from './models/user-favorite-sellers'

const models = [
  User,
  Seller,
  UserFavoriteSellers,
  Boxe,
  Store,
  ProductCategory,
  SellerProductCategories,
]

const sequelize = new Sequelize(databaseConfig)
sequelize.addModels(models)

//!dev
async function testeRelationamento() {
  await sequelize.sync({ force: true })
  const sl1 = await Store.create({
    sector_color: 'orange',
    seller_id: null,
    store_number: 1,
    block_number: 1,
  })
  const sl2 = await Boxe.create({
    sector_color: 'orange',
    seller_id: null,
    street_letter: 'A',
    box_number: 1,
  })
  const sl3 = await Boxe.create({
    sector_color: 'red',
    seller_id: null,
    street_letter: 'P',
    box_number: 120,
  })

  const seller = await Seller.create({
    name: 'Lobo do mau',
    phone_number: '1234567891213',
  })

  sl1.seller_id = seller.id
  sl2.seller_id = seller.id
  sl3.seller_id = seller.id
  await sl1.save()
  await sl2.save()
  await sl3.save()

  const productCategory = await ProductCategory.create({
    category: 'Moda íntima',
  })

  await seller.$add('product_categories', productCategory)

  const sellerProductCategory = await SellerProductCategories.findOne({
    where: { seller_id: seller.id },
  })
  //console.log(sellerProductCategory?.dataValues)

  /*const sellerWithLocations = await Seller.findOne({
    where: { id: seller.id },
    include: [Boxe, Store],
  })

  console.log(sellerWithLocations?.dataValues)*/

  const user = await User.create({
    username: 'João',
    password: '123456',
  })

  await user.$add('favorite_sellers', seller)

  const userWithFavorites = await User.findOne({
    where: { id: user.id },
    include: [Seller],
  })

  console.log(userWithFavorites?.dataValues.favorite_sellers[0].dataValues)
}

testeRelationamento()

export default sequelize
