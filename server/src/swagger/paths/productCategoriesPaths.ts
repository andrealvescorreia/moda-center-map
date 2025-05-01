import type { OpenAPIV3 } from 'openapi-types'

const productCategoriesPaths: OpenAPIV3.PathsObject = {
  '/product-categories': {
    get: {
      summary: 'Get all product categories',
      description: 'Get all product categories registered in the system',
      tags: ['Product Categories'],
      responses: {
        '200': {
          description: 'Product categories found successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/ProductCategoryResponse',
                },
              },
            },
          },
        },
      },
    },
  },
}

export default productCategoriesPaths
