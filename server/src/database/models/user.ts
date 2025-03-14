import bcryptjs from 'bcryptjs'

import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript'

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

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare created_at: Date

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare updated_at: Date

  @BeforeCreate
  static async hashPassword(user: User) {
    user.password_hash = await bcryptjs.hash(user.password, 8)
  }

  passwordIsCorrect(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password_hash)
  }
}
