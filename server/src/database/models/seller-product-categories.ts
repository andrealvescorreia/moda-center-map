import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import ProductCategory from './product-category'
import Seller from './seller'

@Table({
  tableName: 'seller_product_categories',
  timestamps: true,
  modelName: 'SellerProductCategories',
})
export default class SellerProductCategories extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @ForeignKey(() => Seller)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  declare seller_id: string

  @ForeignKey(() => ProductCategory)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  declare category_id: string
}
