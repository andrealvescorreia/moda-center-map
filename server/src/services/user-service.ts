import Boxe from '../database/models/boxe'
import ProductCategory from '../database/models/product-category'
import Store from '../database/models/store'
import User from '../database/models/user'
import type { ValidationError } from '../schemas/validationErrorType'
import { SellerService } from './seller-service'
import { validateEntityId } from './validate-id'

export class UserService {
  private sellerService = new SellerService()
  async findOne(id: string) {
    const errors = await validateEntityId(id, User)
    if (errors.length > 0) {
      return {
        success: false,
        errors,
        data: null,
      }
    }
    return {
      success: true,
      data: await User.findByPk(id),
      errors,
    }
  }

  async addFavoriteSeller(userId: string, sellerId: string) {
    const findUserResult = await this.findOne(userId)
    if (findUserResult.errors.length > 0 || !findUserResult.data) {
      return { success: false, errors: findUserResult.errors }
    }
    const findSellerResult = await this.sellerService.findOne(sellerId)
    if (findSellerResult.errors.length > 0 || !findSellerResult.data) {
      return { success: false, errors: findSellerResult.errors }
    }
    const user = findUserResult.data
    const seller = findSellerResult.data
    await user.$add('favorite_sellers', seller)
    return { success: true, errors: [] }
  }

  async removeFavoriteSeller(userId: string, sellerId: string) {
    const findUserResult = await this.findOne(userId)
    if (findUserResult.errors.length > 0 || !findUserResult.data) {
      return { success: false, errors: findUserResult.errors }
    }
    const findSellerResult = await this.sellerService.findOne(sellerId)
    if (findSellerResult.errors.length > 0 || !findSellerResult.data) {
      return { success: false, errors: findSellerResult.errors }
    }
    const user = findUserResult.data
    const seller = findSellerResult.data

    await user.$remove('favorite_sellers', seller)
    return { success: true, errors: [] }
  }

  async findAllFavoriteSellers(userId: string) {
    const findUserResult = await this.findOne(userId)
    if (findUserResult.errors.length > 0 || !findUserResult.data) {
      return { success: false, errors: findUserResult.errors }
    }
    const user = findUserResult.data

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
    return { success: true, data: favoriteSellers, errors: [] }
  }

  async sellerIsFavorite(userId: string, sellerId: string) {
    const findUserResult = await this.findOne(userId)
    if (findUserResult.errors.length > 0 || !findUserResult.data) {
      return { success: false, errors: findUserResult.errors }
    }
    const findSellerResult = await this.sellerService.findOne(sellerId)
    if (findSellerResult.errors.length > 0 || !findSellerResult.data) {
      return { success: false, errors: findSellerResult.errors }
    }
    const user = findUserResult.data
    const seller = findSellerResult.data

    const isFavorite = await user.$has('favorite_sellers', seller)
    return { success: true, errors: [], isFavorite }
  }

  //TODO: refactor to reduce validation copy paste
  async putNoteOnSeller(userId: string, sellerId: string, text: string) {
    const userResult = await this.findOne(userId)
    if (userResult.errors.length > 0 || !userResult.data) {
      return { success: false, errors: userResult.errors }
    }
    const user = userResult.data

    const sellerResult = await this.sellerService.findOne(sellerId)
    if (sellerResult.errors.length > 0 || !sellerResult.data) {
      return { success: false, errors: sellerResult.errors }
    }
    const seller = sellerResult.data

    await user.$add('sellers_notes', seller, { through: { text } })
    const note = await user.$get('notes', {
      where: { seller_id: seller.id },
    })

    return {
      success: true,
      data: { id: note[0].id, text: note[0].text },
      errors: [],
    }
  }

  async findOneNote(userId: string, sellerId: string) {
    const errors: ValidationError[] = []
    const userResult = await this.findOne(userId)
    if (userResult.errors.length > 0 || !userResult.data) {
      return { success: false, errors: userResult.errors, data: null }
    }
    const user = userResult.data

    const sellerResult = await this.sellerService.findOne(sellerId)
    if (sellerResult.errors.length > 0 || !sellerResult.data) {
      return { success: false, errors: sellerResult.errors, data: null }
    }
    const seller = sellerResult.data

    const notes = await user.$get('notes', {
      where: { seller_id: seller.id },
    })
    if (notes.length === 0) {
      return {
        success: true,
        errors,
        data: null,
      }
    }
    return {
      success: true,
      errors,
      data: { id: notes[0].id, text: notes[0].text },
    }
  }
}
