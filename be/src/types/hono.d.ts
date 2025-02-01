import { Context } from 'hono'

declare module 'hono' {
  interface ContextVariableMap {
    user: {
      id: string
      name: string
      email: string
      role: 'DOCTOR' | 'PATIENT' | 'PHARMACIST'
    }
  }
}