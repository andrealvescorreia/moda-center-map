import type { OpenAPIV3 } from 'openapi-types'
import { CreatedAt } from 'sequelize-typescript'
import ProductCategory from './database/models/product-category'
import { serverUrl } from './env'

const boxeSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['sector_color', 'street_letter', 'box_number'],
  properties: {
    sector_color: {
      enum: ['blue', 'orange', 'red', 'green', 'yellow', 'white'],
      description: 'The color of the sector where the box is located',
    },
    street_letter: {
      type: 'string',
      description: 'The letter of the street where the box is located',
      pattern: '^[A-P]$',
    },
    box_number: {
      type: 'integer',
      description:
        'The number of the box where the seller is located. The max value depends on the sector color (ex: blue, orange, green and red have 120 boxes)',
      minimum: 1,
      maximum: 128,
    },
  },
  example: {
    sector_color: 'blue',
    street_letter: 'A',
    box_number: 2,
  },
}

const storeSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['sector_color', 'block_number', 'store_number'],
  properties: {
    sector_color: {
      enum: ['blue', 'orange', 'red', 'green', 'yellow', 'white'],
      description: 'The color of the sector where the store is located',
    },
    block_number: {
      type: 'integer',
      description:
        'The number of the block where the store is located. The max value depends on the sector color (ex: yellow and white have 5 blocks)',
      minimum: 1,
      maximum: 9,
    },
    store_number: {
      type: 'integer',
      description:
        'The number of the store where the seller is located. The max value depends on the block number and sector color',
      minimum: 1,
      maximum: 19,
    },
  },
  example: {
    sector_color: 'blue',
    block_number: 1,
    store_number: 1,
  },
}

const sellerBaseSchema: OpenAPIV3.SchemaObject = {
  properties: {
    name: {
      type: 'string',
      description: 'The name of the seller. Must be unique',
      example: 'Minha loja',
      minLength: 3,
      maxLength: 255,
    },
    phone_number: {
      type: 'string',
      description:
        'The phone number of the seller, in ddd99999999 brazilian format',
      pattern: '^[0-9]{10,11}$',
      example: '8399445256',
      minLength: 10,
      maxLength: 11,
    },
  },
}

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
    '/user': {
      post: {
        summary: 'Create a new user',
        description:
          'Create a new user with username and password. Returns the id of the newly created user.',
        tags: ['User'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUserBody',
              },
            },
          },
        },
        responses: {
          '201': {
            description:
              'User created successfully. An httpOnly cookie named "authtoken" is set on client side.',
            headers: {
              'Set-Cookie': {
                description: 'Contains the httpOnly "authtoken" cookie.',
                schema: {
                  type: 'string',
                },
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreatedUserResponse',
                },
              },
            },
          },
          '400': {
            description: 'Bad request, invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  errors: [
                    {
                      code: 'TOO_SHORT',
                      field: 'password',
                      message: 'String must contain at least 6 character(s)',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Get the current user',
        description:
          'Get the currently authenticated user. Returns the id and username of the user.',
        tags: ['User'],
        responses: {
          '200': {
            description: 'User found successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized, user not logged in',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth': {
      post: {
        summary: 'Login a user',
        description:
          'Login a user with username and password. Returns the id of the user.',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginUserBody',
              },
            },
          },
        },
        responses: {
          '200': {
            description:
              'User logged in successfully. An httpOnly cookie named "authtoken" is set on client side.',
            headers: {
              'Set-Cookie': {
                description: 'Contains the httpOnly "authtoken" cookie.',
                schema: {
                  type: 'string',
                },
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized, invalid username or password',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  example: {
                    errors: ['Senha inválida'],
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Logout the current user',
        description:
          'Logout the current user by clearing the httpOnly cookie named "authtoken".',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginUserBody',
              },
            },
          },
        },
        responses: {
          '200': {
            description:
              'User logged out successfully. The httpOnly cookie named "authtoken" is cleared on client side.',
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                  example: 'logged out!',
                },
              },
            },
          },
        },
      },
    },
    '/seller': {
      get: {
        summary: 'Get all sellers',
        description: 'Get all sellers registered in the system',
        tags: ['Seller'],
        parameters: [
          {
            name: 'order',
            in: 'query',
            description:
              'The order of the results, either ascending (asc) or descending (desc)',
            required: false,
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
          },
          {
            name: 'order_by',
            in: 'query',
            description: 'The property of the seller to order the results by',
            required: false,
            schema: {
              type: 'string',
              enum: ['name', 'phone_number', 'createdAt', 'updatedAt', 'id'],
              default: 'createdAt',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Sellers found successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/SellerResponse',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new seller',
        description: 'Create a new seller with selling locations.',
        tags: ['Seller'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateSellerBody',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Seller created successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SellerResponse',
                },
              },
            },
          },
          '400': {
            description: 'Bad request, invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  errors: [
                    {
                      code: 'TOO_SHORT',
                      field: 'name',
                      message: 'String must contain at least 3 character(s)',
                    },
                  ],
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized, user not logged in',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedResponse',
                },
              },
            },
          },
        },
      },
    },
    '/seller/boxe': {
      get: {
        summary: 'Get seller by boxe',
        description:
          'Get the seller located in a specific boxe. Returns the seller object.',
        tags: ['Seller'],
        parameters: [
          {
            name: 'sector_color',
            in: 'query',
            description: 'The color of the sector where the box is located',
            required: true,
            schema: {
              type: 'string',
              enum: ['blue', 'orange', 'red', 'green', 'yellow', 'white'],
            },
          },
          {
            name: 'street_letter',
            in: 'query',
            description:
              'The letter of the street where the box is located (A-P)',
            required: true,
            schema: {
              type: 'string',
              pattern: '^[A-P]$',
            },
          },
          {
            name: 'box_number',
            in: 'query',
            description: 'The number of the box where the seller is located',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 128,
            },
          },
        ],
        responses: {
          '200': {
            description:
              'Seller found successfully. Returns the seller object.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SellerResponse',
                },
              },
            },
          },
          '404': {
            description: 'Seller not found in the specified boxe.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  example: {
                    message: 'This boxe does not belong to a seller',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/seller/store': {
      get: {
        summary: 'Get seller by store',
        description:
          'Get the seller located in a specific store. Returns the seller object.',
        tags: ['Seller'],
        parameters: [
          {
            name: 'sector_color',
            in: 'query',
            description: 'The color of the sector where the store is located',
            required: true,
            schema: {
              type: 'string',
              enum: ['blue', 'orange', 'red', 'green', 'yellow', 'white'],
            },
          },
          {
            name: 'block_number',
            in: 'query',
            description: 'The number of the block where the store is located',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 9,
            },
          },
          {
            name: 'store_number',
            in: 'query',
            description: 'The number of the store where the seller is located',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 19,
            },
          },
        ],
        responses: {
          '200': {
            description:
              'Seller found successfully. Returns the seller object.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SellerResponse',
                },
              },
            },
          },
          '404': {
            description:
              'Seller not found in the specified store. Returns an error message.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  example: {
                    errors: ['Nenhum vendedor encontrado nessa loja'],
                  },
                },
              },
            },
          },
        },
      },
    },
    '/seller/id/{id}': {
      get: {
        summary: 'Get seller by id',
        description: 'Get the seller by id. Returns the seller object.',
        tags: ['Seller'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The id of the seller',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description:
              'Seller found successfully. Returns the seller object.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SellerResponse',
                },
              },
            },
          },
          '400': {
            description: 'Bad request, invalid id format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  example: {
                    message: 'Invalid id',
                  },
                },
              },
            },
          },
          '404': {
            description: 'Seller not found.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  example: {
                    message: 'Seller not found',
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a seller by id',
        description: 'Delete the seller by id.',
        tags: ['Seller'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The id of the seller',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Seller deleted successfully',
          },
          '400': {
            description: 'Bad request, invalid id format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  example: {
                    message: 'Invalid id',
                  },
                },
              },
            },
          },
          '404': {
            description: 'Seller not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  example: {
                    message: 'Seller not found',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/seller/search': {
      get: {
        summary: 'Search seller',
        description: 'search seller by search term',
        tags: ['Seller'],
        parameters: [
          {
            name: 'searchTerm',
            in: 'query',
            description: 'The search term to search for',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'limit',
            in: 'query',
            description:
              'The maximum number of results to return. Default is 10',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              default: null,
            },
          },
          {
            name: 'offset',
            in: 'query',
            description:
              'The number of results to skip before returning the results. Default is 0',
            required: false,
            schema: {
              type: 'integer',
              default: null,
            },
          },
        ],
        responses: {
          '200': {
            description: 'Sellers found successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/SellerResponse',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/seller/favorite/{id}': {
      post: {
        summary: 'Favorite a seller',
        description: 'Favorite a seller by id',
        tags: ['Seller'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The id of the seller',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Seller favorited successfully.',
            content: {
              'application/json': {
                schema: {
                  properties: {
                    message: {
                      type: 'string',
                      description: 'Success message',
                      example: 'Seller favorited',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request, invalid id format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  example: {
                    message: 'Invalid id',
                  },
                },
              },
            },
          },
          '404': {
            description:
              'Seller or current User not found. Returns an error message.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      description: 'Error message',
                      example: 'Seller not found',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized, user not logged in',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Unfavorite a seller',
        description: 'Unfavorite a seller by id',
        tags: ['Seller'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The id of the seller',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Seller unfavorited successfully',
            content: {
              'application/json': {
                schema: {
                  properties: {
                    message: {
                      type: 'string',
                      description: 'Success message',
                      example: 'Seller unfavorited',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request, invalid id format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  example: {
                    message: 'Invalid id',
                  },
                },
              },
            },
          },
          '404': {
            description:
              'Seller or current User not found. Returns an error message.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      description: 'Error message',
                      example: 'Seller not found',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized, user not logged in',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedResponse',
                },
              },
            },
          },
        },
      },
    },
    '/seller/favorite': {
      get: {
        summary: 'Get all favorite sellers',
        description: 'Get all favorite sellers of the current user',
        tags: ['Seller'],
        responses: {
          '200': {
            description: 'Favorite sellers found successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/SellerResponse',
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized, user not logged in',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      description: 'Error message',
                      example: 'User not found',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
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
  },
  // ----- SCHEMAS ------
  components: {
    schemas: {
      CreateUserBody: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            minLength: 3,
            maxLength: 255,
            description: 'The username of the user. Must be unique.',
          },
          password: {
            type: 'string',
            minLength: 6,
            maxLength: 50,
            description: 'The password of the user.',
          },
        },
        required: ['username', 'password'],
        example: {
          username: 'JohnDoe',
          password: '123456',
        },
      },
      CreatedUserResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'The id of the user, generated on creation, in UUID format',
            format: 'uuid',
          },
          username: {
            type: 'string',
            description: 'The username of the user',
          },
        },
        example: {
          id: '5b2df532-846f-4556-992d-5c8c5e2d3406',
          username: 'JohnDoe',
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description:
              'The id of the user, generated on creation, in UUID format',
          },
          username: {
            type: 'string',
            description: 'The username of the user',
          },
        },
        example: {
          userId: '5b2df532-846f-4556-992d-5c8c5e2d3406',
          username: 'JohnDoe',
        },
      },
      LoginUserBody: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'The username of the existing user.',
          },
          password: {
            type: 'string',
            description: 'The password of the user.',
          },
        },
        required: ['username', 'password'],
        example: {
          username: 'JohnDoe',
          password: '123456',
        },
      },
      CreateSellerBody: {
        type: 'object',
        required: ['name', 'sellingLocations'],
        properties: {
          ...sellerBaseSchema.properties,
          sellingLocations: {
            type: 'object',
            description:
              'The locations where the seller sells their products inside Moda Center. Must have at least one location (box or store)',
            properties: {
              boxes: {
                type: 'array',
                uniqueItems: true,
                items: {
                  ...boxeSchema,
                },
              },
              stores: {
                type: 'array',
                uniqueItems: true,
                items: {
                  ...storeSchema,
                },
              },
            },
          },
          product_categories: {
            type: 'array',
            items: {
              type: 'string',
              description:
                'The categories of products sold by the seller. Must be one of the existing categories in the system', //TODO: add link to get categories endpoint
              example: ['Jeans', 'Calçados'],
            },
          },
        },
      },
      SellerResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'The id of the seller, generated on creation, in UUID format',
            format: 'uuid',
          },
          ...sellerBaseSchema.properties,

          boxes: {
            type: 'array',
            uniqueItems: true,
            items: {
              ...boxeSchema,
            },
          },
          stores: {
            type: 'array',
            uniqueItems: true,
            items: {
              ...storeSchema,
            },
          },
          product_categories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The id of the product category, in UUID format',
                  format: 'uuid',
                },
                category: {
                  type: 'string',
                  description: 'The name of the product category',
                  example: 'Jeans',
                },
              },
            },
          },
        },
      },
      ProductCategoryResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'The id of the product category, generated on creation, in UUID format',
            format: 'uuid',
          },
          category: {
            type: 'string',
            description: 'The name of the product category',
            example: 'Jeans',
          },
          createdAt: {
            type: 'string',
            description: 'The date when the product category was created',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            description: 'The date when the product category was updated',
            format: 'date-time',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'The code of the error',
                },
                field: {
                  type: 'string',
                  description: 'The field where the error occurred',
                },
                message: {
                  type: 'string',
                  description: 'A detailed error message, in english',
                },
              },
            },
          },
        },
        example: {
          errors: [
            {
              code: 'TOO_SHORT',
              field: 'password',
              message: 'String must contain at least 6 character(s)',
            },
          ],
        },
      },
      UnauthorizedResponse: {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
        example: {
          errors: [
            {
              message: 'Login required',
            },
          ],
        },
      },
    },
  },
}

export default swaggerDefinition
