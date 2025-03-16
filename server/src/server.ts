import './database/index' //executes the database connection
import app from './app'
const port = 3001

app.listen(port, () => {
  console.log()
  console.log(`Rodando em http://localhost:${port}`)
})
