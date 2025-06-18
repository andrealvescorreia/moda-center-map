import bcryptjs from 'bcryptjs'

import {
  BeforeCreate,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript'
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
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare username: string

  @Column({
    type: DataType.VIRTUAL, // 💡 campo que não fica salvo no BD.
    allowNull: false,
  })
  declare password: string

  @Column({
    type: DataType.STRING,
  })
  declare password_hash: string

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

  @HasMany(() => Notes, { onDelete: 'CASCADE' })
  declare notes: Notes[]

  @BeforeCreate
  static async hashPassword(user: User) {
    user.password_hash = await bcryptjs.hash(user.password, 8)
  }

  passwordIsCorrect(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password_hash)
  }
}
