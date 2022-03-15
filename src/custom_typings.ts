import 'express'

declare module 'express' {
  interface Request {
    session?: {
      user: any
    }
  }
}