export default interface User {
  id: string
  type: 'local' | 'google'
  username?: string // local
  name?: string // google
  sub?: string // google
}
