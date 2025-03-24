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
    type: DataType.CHAR(11),
  })
  declare phone_number: string

  @Column({
    type: 'TSVECTOR', //sequelize specific
    allowNull: true,
  })
  declare search_vector: string

  @HasMany(() => Boxe, { onDelete: 'CASCADE' })
  declare boxes: Boxe[]

  @HasMany(() => Store, { onDelete: 'CASCADE' })
  declare stores: Store[]

  @BelongsToMany(() => User, {
    through: () => UserFavoriteSellers,
    onDelete: 'CASCADE',
  })
  declare users: User[]

  @BelongsToMany(() => ProductCategory, {
    through: () => SellerProductCategories,
    onDelete: 'CASCADE',
  })
  declare product_categories: ProductCategory[]
}
