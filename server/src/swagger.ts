import type express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDefinition from './swagger-definition'

// Function to setup swagger docs in Express
export const setupSwaggerDocs = (app: express.Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition))
}
