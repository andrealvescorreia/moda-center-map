import type { NextFunction, Request, Response } from 'express'
import { ZodError, type z } from 'zod'

export function validateData(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: z.ZodIssue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        res.status(400).json({ error: 'Invalid data', details: errorMessages })
      } else {
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  }
}
