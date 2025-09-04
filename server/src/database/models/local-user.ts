import bcryptjs from 'bcryptjs'

import {
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import User from './user'

@Table({
  tableName: 'local_users',
  timestamps: true,
  modelName: 'LocalUser',
})
export default class LocalUser extends Model {
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

  @BeforeCreate
  static async hashPassword(user: LocalUser) {
    user.password_hash = await bcryptjs.hash(user.password, 8)
  }

  passwordIsCorrect(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password_hash)
  }
}
