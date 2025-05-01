import type { OpenAPIV3 } from 'openapi-types'
import { serverUrl } from '../env'
import authPaths from './paths/authPaths'
import productCategoriesPaths from './paths/productCategoriesPaths'
import sellerPaths from './paths/sellerPaths'
import userPaths from './paths/userPaths'
import swaggerSchemas from './swaggerSchemas'

const swaggerDefinition: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Moda Center Map API',
    description:
      'This is the API documentation for the Moda Center Map platform',
    version: '1.0.0',
  },
  servers: [
    {
      url: serverUrl,
      description: 'Server URL',
    },
  ],
  paths: {
    ...userPaths,
    ...authPaths,
    ...sellerPaths,
    ...productCategoriesPaths,
  },
  components: {
    schemas: swaggerSchemas.schemas,
  },
}

export default swaggerDefinition
