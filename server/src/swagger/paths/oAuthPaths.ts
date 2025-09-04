import type { OpenAPIV3 } from 'openapi-types'

const oAuthPaths: OpenAPIV3.PathsObject = {
  '/request-oauth/google': {
    post: {
      summary: 'Request a google sign-in url',
      description: 'This endpoint initiates the OAuth flow for Google sign-in.',
      tags: ['OAuth'],
      responses: {
        '200': {
          description:
            'Successfully initiated OAuth flow for Google sign-in. Returns the URL to redirect the user to.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                    example:
                      'https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=YOUR_SCOPES',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/oauth/google': {
    post: {
      summary: 'Handle Google OAuth callback',
      description:
        'In the google OAuth flow, this will be called after the user authorizes the application to use their google account. Will create a new user in the Database if one with the same sub (subject id) does not already exist. Sets a cookie for authentication and redirects to the web app user page.',
      tags: ['OAuth'],
      responses: {
        '303': {
          description:
            'User logged in successfully. An httpOnly cookie named "authtoken" is set on client side. Redirects to the user page.',
          headers: {
            'Set-Cookie': {
              description: 'Contains the httpOnly "authtoken" cookie.',
              schema: {
                type: 'string',
              },
            },
          },
        },
        '403': {
          description: 'Forbidden, insufficient permissions',
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
                  errors: ['Invalid credentials'],
                },
              },
            },
          },
        },
      },
    },
  },
}

export default oAuthPaths
