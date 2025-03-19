import axios from 'axios'

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

export async function getUser() {
  return await axiosInstance.get('http://localhost:3001/user')
}
