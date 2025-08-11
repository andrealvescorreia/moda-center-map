export type ValidationError = {
  code: string
  field: string
  message: string
  occupiedBy?: {
    id: string
    name: string
  }
}
