import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript'
import Seller from './seller'
import SellerProductCategories from './seller-product-categories'

@Table({
  tableName: 'product_categories',
  timestamps: true,
  modelName: 'ProductCategory',
})
export default class ProductCategory extends Model {
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
    defaultValue: DataType.UUIDV4,
    unique: true,
  })
  declare category: string

  @BelongsToMany(
    () => Seller,
    () => SellerProductCategories
  )
  declare sellers: Seller[]
}
