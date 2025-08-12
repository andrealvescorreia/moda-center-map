import Boxe from '../database/models/boxe'
import ProductCategory from '../database/models/product-category'
import Seller from '../database/models/seller'
import Store from '../database/models/store'
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

  async removeFavoriteSeller(userId: string, sellerId: string) {
    let errors = await validateEntityId(userId, User)
    errors = errors.concat(await validateEntityId(sellerId, Seller))
    if (errors.length > 0) return { success: false, errors }

    const user = await this.findOne(userId)
    const seller = await this.sellerService.findOne(sellerId)
    if (!seller || !user) return { success: false, errors }

    await user.$remove('favorite_sellers', seller)
    return { success: true, errors }
  }

  async findAllFavoriteSellers(userId: string) {
    const errors = await validateEntityId(userId, User)
    const user = await this.findOne(userId)
    if (errors.length > 0 || !user)
      return { success: false, errors, data: null }

    const favoriteSellers = await user.$get('favorite_sellers', {
      include: [
        { model: Boxe, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        { model: Store, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        {
          model: ProductCategory,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'search_vector'] },
    })
    return { success: true, data: favoriteSellers, errors }
  }
}
