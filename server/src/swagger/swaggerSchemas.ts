import type { OpenAPIV3 } from 'openapi-types'

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

const swaggerSchemas: OpenAPIV3.ComponentsObject = {
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
}

export default swaggerSchemas
