import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import User from './user'

// for more information, see:
// https://developers.google.com/identity/openid-connect/openid-connect?hl=pt-br#authenticationuriparameters
@Table({
  tableName: 'google_users',
  timestamps: true,
  modelName: 'GoogleUser',
})
export default class GoogleUser extends Model {
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    //defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @BelongsTo(() => User, 'id')
  declare user: User

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare sub: string // unique google identifier. max lenght: 255

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  declare name: string
}
