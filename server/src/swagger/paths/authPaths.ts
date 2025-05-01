import type { OpenAPIV3 } from 'openapi-types'

const authPaths: OpenAPIV3.PathsObject = {
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
}

export default authPaths
