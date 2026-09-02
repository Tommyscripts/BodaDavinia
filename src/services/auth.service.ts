import { login as apiLogin } from './api'

export type LoginResponse = any

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  // Reuse the central `login` helper from `src/services/api.ts`.
  // The API helper expects an object with `email` and `password`.
  const res = await apiLogin({ email: username, password })
  return res
}