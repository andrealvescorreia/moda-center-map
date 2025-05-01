import './database/index' //executes the database connection
import app from './app'

import { setup } from './database/index'
import { env, serverUrl } from './env'
import { setupSwaggerDocs } from './swagger'
setupSwaggerDocs(app)

setup().then(() => {
  app.listen(env.PORT, () => {
    console.log(`\nRunning on ${serverUrl}`)
  })
})
