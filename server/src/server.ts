import './database/index' //executes the database connection
import app from './app'

import { setupDatabase } from './database/index'
import { env, serverUrl } from './env'
import { setupSwaggerDocs } from './swagger'
setupSwaggerDocs(app)

setupDatabase().then(() => {
  app.listen(env.PORT, () => {
    console.log(`\nRunning on ${serverUrl}`)
    console.log(`\nAPI DOCS ${serverUrl}/api-docs`)
  })
})
