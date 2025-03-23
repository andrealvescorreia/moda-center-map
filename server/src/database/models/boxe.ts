import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import Seller from './seller'

@Table({
  tableName: 'boxes',
  timestamps: true,
  modelName: 'Boxe',
})
export default class Boxe extends Model {
  //SellingLocation start
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    allowNull: false,
    type: DataType.ENUM('orange', 'blue', 'red', 'green', 'yellow', 'white'),
  })
  declare sector_color: string

  @ForeignKey(() => Seller)
  @Column({
    type: DataType.UUID,
    onDelete: 'CASCADE',
  })
  declare seller_id: string

  @BelongsTo(() => Seller, { onDelete: 'CASCADE' })
  declare seller: Seller
  //SellingLocation end

  @Column({
    allowNull: false,
    type: DataType.CHAR(1),
  })
  declare street_letter: string

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare box_number: number
}
