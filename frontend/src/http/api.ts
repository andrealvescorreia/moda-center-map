import axios from 'axios'
import type { BoxeSchema } from '../schemas/box'
import type { StoreSchema } from '../schemas/store'
import type { SellerResponse } from './responses'

const axiosInstance = axios.create({
  withCredentials: true,
  //baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function registerUser(data: {
  username: string
  password: string
}) {
  return await axiosInstance.post('http://localhost:3001/user', data)
}

export async function loginUser(data: {
  username: string
  password: string
}) {
  return await axiosInstance.post('http://localhost:3001/auth', data)
}

export async function logoutUser() {
  return await axiosInstance.post('http://localhost:3001/auth/logout')
}

export async function getUser() {
  return await axiosInstance.get('http://localhost:3001/user')
}

export async function getSellers() {
  const response = await axiosInstance.get('http://192.168.1.147:3001/seller')
  const sellers: SellerResponse[] = response.data
  return sellers
}

export async function getProductCategories() {
  return await axiosInstance.get('http://localhost:3001/product-categories')
}

interface NewSeller {
  name: string
  phone_number: string | undefined
  sellingLocations: { boxes: BoxeSchema[]; stores: StoreSchema[] }
  productCategories: string[]
}

export async function createSeller(data: NewSeller) {
  return await axiosInstance.post('http://localhost:3001/seller', data)
}
