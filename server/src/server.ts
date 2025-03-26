import './database/index' //executes the database connection
import app from './app'
const port = 3001

import { setup } from './database/index'

setup().then(() => {
  app.listen(port, () => {
    console.log()
    console.log(`Rodando em http://localhost:${port}`)
  })
})
