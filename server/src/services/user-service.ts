import Seller from '../database/models/seller'
import User from '../database/models/user'
import { SellerService } from './seller-service'
import { validateEntityId } from './validate-id'

export class UserService {
  private sellerService = new SellerService()
  async findOne(id: string) {
    return await User.findByPk(id)
  }

  async addFavoriteSeller(userId: string, sellerId: string) {
    let errors = await validateEntityId(userId, User)
    errors = errors.concat(await validateEntityId(sellerId, Seller))
    if (errors.length > 0) return { success: false, errors }

    const user = await this.findOne(userId)
    const seller = await this.sellerService.findOne(sellerId)
    if (!seller || !user) return { success: false, errors }

    await user.$add('favorite_sellers', seller)
    return { success: true, errors }
  }
}
