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
    //user.password = await bcrypt.hash(user.password, 10)
    console.log('hashPassword')
  }
}
