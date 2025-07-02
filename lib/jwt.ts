import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta-super-segura"

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return null
  }
}
