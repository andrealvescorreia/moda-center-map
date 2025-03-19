import axios from 'axios'

export async function registerUser(data: {
  username: string
  password: string
}) {
  return await axios.post('http://localhost:3001/user', data)

  //return response.data
}
