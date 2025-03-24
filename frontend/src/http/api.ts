import axios from 'axios'
import type { BoxeSchema } from '../schemas/box'
import type { StoreSchema } from '../schemas/store'
import type { SellerResponse } from './responses'

const axiosInstance = axios.create({
  withCredentials: true,
  //baseURL: import.meta.env.VITE_API_URL,
  //baseURL: 'http://192.168.1.147:3001',//!login não funciona no chrome localmente, mas sim no firefox (mobile)
  baseURL: 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
})

export async function registerUser(data: {
  username: string
  password: string
}) {
  return await axiosInstance.post('user', data)
}

export async function loginUser(data: {
  username: string
  password: string
}) {
  return await axiosInstance.post('auth', data)
}

export async function logoutUser() {
  return await axiosInstance.post('auth/logout')
}

export async function getUser() {
  return await axiosInstance.get('user')
}

export async function getSellers() {
  const response = await axiosInstance.get('seller')
  const sellers: SellerResponse[] = response.data
  return sellers
}
export async function getSeller(id: string) {
  const response = await axiosInstance.get(`seller/id/${id}`)
  const seller: SellerResponse = response.data
  return seller
}

export async function deleteSeller(id: string) {
  return await axiosInstance.delete(`seller/id/${id}`)
}

export async function getSellerByBox({
  sector_color,
  box_number,
  street_letter,
}: BoxeSchema) {
  const response = await axiosInstance.get(
    `seller/boxe?sector_color=${sector_color}&street_letter=${street_letter}&box_number=${box_number}`
  )
  const seller: SellerResponse = response.data
  return seller
}

export async function getSellerByStore({
  sector_color,
  block_number,
  store_number,
}: StoreSchema) {
  const response = await axiosInstance.get(
    `seller/store?sector_color=${sector_color}&block_number=${block_number}&store_number=${store_number}`
  )
  const seller: SellerResponse = response.data
  return seller
}

export async function searchSeller(searchTerm: string) {
  const response = await axiosInstance.get(
    `seller/search?searchTerm=${searchTerm}`
  )
  const sellers: SellerResponse[] = response.data
  return sellers
}

export async function getProductCategories() {
  return await axiosInstance.get('product-categories')
}

interface NewSeller {
  name: string
  phone_number: string | undefined
  sellingLocations: { boxes: BoxeSchema[]; stores: StoreSchema[] }
  productCategories: string[]
}

export async function createSeller(data: NewSeller) {
  return await axiosInstance.post('seller', data)
}

export async function favoriteSeller(seller_id: string) {
  return await axiosInstance.post(`seller/favorite/${seller_id}`)
}

export async function unfavoriteSeller(seller_id: string) {
  return await axiosInstance.delete(`seller/favorite/${seller_id}`)
}

export async function getFavorites() {
  const response = await axiosInstance.get('seller/favorite')
  const sellers: SellerResponse[] = response.data
  return sellers
}

export async function sellerIsFavorite(id: string) {
  const response = await axiosInstance.get(`seller/favorite/${id}`)
  const isFavoriteRes: { isFavorite: boolean } = response.data
  return isFavoriteRes
}
