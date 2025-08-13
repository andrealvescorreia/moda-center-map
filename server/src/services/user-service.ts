import Boxe from '../database/models/boxe'
import ProductCategory from '../database/models/product-category'
import type Seller from '../database/models/seller'
import Store from '../database/models/store'
import User from '../database/models/user'
import type { OperationReport } from '../interfaces/operation-report'
import type { ValidationError } from '../schemas/validationErrorType'
import { SellerService } from './seller-service'
import { validateEntityId } from './validate-id'

export class UserService {
  private sellerService = new SellerService()

  async findOne(id: string): Promise<OperationReport & { data: User | null }> {
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
      errors,
      data: await User.findByPk(id),
    }
  }

  async addFavoriteSeller(
    userId: string,
    sellerId: string
  ): Promise<OperationReport> {
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

  async removeFavoriteSeller(
    userId: string,
    sellerId: string
  ): Promise<OperationReport> {
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

  async findAllFavoriteSellers(
    userId: string
  ): Promise<OperationReport & { data: Seller[] }> {
    const findUserResult = await this.findOne(userId)
    if (findUserResult.errors.length > 0 || !findUserResult.data) {
      return { success: false, errors: findUserResult.errors, data: [] }
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
    return { success: true, errors: [], data: favoriteSellers }
  }

  async sellerIsFavorite(
    userId: string,
    sellerId: string
  ): Promise<OperationReport & { isFavorite: boolean }> {
    const findUserResult = await this.findOne(userId)
    if (findUserResult.errors.length > 0 || !findUserResult.data) {
      return {
        success: false,
        errors: findUserResult.errors,
        isFavorite: false,
      }
    }
    const findSellerResult = await this.sellerService.findOne(sellerId)
    if (findSellerResult.errors.length > 0 || !findSellerResult.data) {
      return {
        success: false,
        errors: findSellerResult.errors,
        isFavorite: false,
      }
    }
    const user = findUserResult.data
    const seller = findSellerResult.data

    const isFavorite = await user.$has('favorite_sellers', seller)
    return { success: true, errors: [], isFavorite }
  }

  async putNoteOnSeller(
    userId: string,
    sellerId: string,
    text: string
  ): Promise<OperationReport & { data: { id: string; text: string } | null }> {
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

  async findOneNote(
    userId: string,
    sellerId: string
  ): Promise<OperationReport & { data: { id: string; text: string } | null }> {
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
