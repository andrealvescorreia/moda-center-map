import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import Seller from './seller'
import User from './user'

@Table({
  tableName: 'notes',
  timestamps: true,
  modelName: 'Notes',
})
export default class Notes extends Model {
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

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  declare user_id: string

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare text: string
}
