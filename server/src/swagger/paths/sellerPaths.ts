import type { OpenAPIV3 } from 'openapi-types'

const sellerPaths: OpenAPIV3.PathsObject = {
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
          description: 'Seller found successfully. Returns the seller object.',
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
          description: 'Seller found successfully. Returns the seller object.',
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
          description: 'Seller found successfully. Returns the seller object.',
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
    put: {
      summary: 'Update a seller by id',
      description: 'Update the seller by id.',
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
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateSellerBody',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Seller updated successfully.',
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
        '404': {
          description:
            'Seller not found. Returns an error message if the seller does not exist.',
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
                example: [
                  {
                    code: 'NOT_FOUND',
                    field: 'id',
                    message: 'Seller not found',
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  '/seller/id/{id}/note': {
    put: {
      summary: 'Add a note to a seller',
      description: 'A personal note for a seller, only visible to the user.',
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
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'The text of the note',
                  example: 'This is a test note,\n hello friend.',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Note saved sucessfully.',
          content: {
            'application/json': {
              schema: {
                properties: {
                  id: {
                    type: 'string',
                    description:
                      'The id of the note, generated on creation, in UUID format',
                    format: 'uuid',
                  },
                  text: {
                    type: 'string',
                    description: 'The text of the note',
                    example: 'This is a test note,\n hello friend.',
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
    get: {
      summary: 'Get note about seller',
      description: 'A personal note for a seller, only visible to the user.',
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
          description: 'Note found.',
          content: {
            'application/json': {
              schema: {
                properties: {
                  id: {
                    type: 'string',
                    description:
                      'The id of the note, generated on creation, in UUID format',
                    format: 'uuid',
                  },
                  text: {
                    type: 'string',
                    description: 'The text of the note',
                    example: 'This is a test note,\n hello friend.',
                  },
                },
              },
            },
          },
        },
        '404': {
          description:
            'Seller, Note or current User not found. Returns an error message.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Note not found',
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
          description: 'The maximum number of results to return. Default is 10',
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
}

export default sellerPaths
