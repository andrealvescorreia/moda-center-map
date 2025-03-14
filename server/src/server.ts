import { config } from 'dotenv'
import app from './app'
config()
const port = 3001

app.listen(port, () => {
  console.log()
  console.log(`Rodando em http://localhost:${port}`)
})
