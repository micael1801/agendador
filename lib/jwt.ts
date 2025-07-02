import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta-muito-segura"

export interface JWTPayload {
  userId: number
  email: string
  tipoUsuario: string
  empresaId: number
  iat?: number
  exp?: number
}

export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}
