import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript'
import Boxe from './boxe'
import ProductCategory from './product-category'
import SellerProductCategories from './seller-product-categories'
import Store from './store'
import User from './user'
import UserFavoriteSellers from './user-favorite-sellers'

@Table({
  tableName: 'sellers',
  timestamps: true,
  modelName: 'Seller',
})
export default class Seller extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string

  @Column({
    allowNull: true,
    type: DataType.CHAR(13),
  })
  declare phone_number: string

  @HasMany(() => Store)
  declare stores: Store[]

  @HasMany(() => Boxe)
  declare boxes: Boxe[]

  @BelongsToMany(
    () => User,
    () => UserFavoriteSellers
  )
  declare users: User[]

  @BelongsToMany(
    () => ProductCategory,
    () => SellerProductCategories
  )
  declare product_categories: ProductCategory[]
}
