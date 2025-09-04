import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript'
import GoogleUser from './google-user'
import LocalUser from './local-user'
import Notes from './note'
import Seller from './seller'
import UserFavoriteSellers from './user-favorite-sellers'

@Table({
  tableName: 'users',
  timestamps: true,
  modelName: 'User',
})
export default class User extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    type: DataType.ENUM('local', 'google'),
    allowNull: false,
    defaultValue: 'local',
  })
  declare type: string

  @BelongsToMany(
    () => Seller,
    () => UserFavoriteSellers //associative table
  )
  declare favorite_sellers: Seller[]

  @BelongsToMany(
    () => Seller,
    () => Notes
  )
  declare sellers_notes: Seller[]

  @HasOne(() => LocalUser, { onDelete: 'CASCADE' })
  declare localUser: LocalUser

  @HasOne(() => GoogleUser, { onDelete: 'CASCADE' })
  declare googleUser: GoogleUser

  @HasMany(() => Notes, { onDelete: 'CASCADE' })
  declare notes: Notes[]
}
