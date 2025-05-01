import type { OpenAPIV3 } from 'openapi-types'

const userPaths: OpenAPIV3.PathsObject = {
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
}

export default userPaths
