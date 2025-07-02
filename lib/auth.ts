import type { NextRequest } from "next/server"
import { verifyToken } from "./jwt"
import { prisma } from "./prisma"

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded || typeof decoded === "string") {
      return null
    }

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: {
        atendente: true,
      },
    })

    return user
  } catch (error) {
    console.error("Erro na autenticação:", error)
    return null
  }
}

export function isAdmin(user: any) {
  return user?.tipo === "ADMIN"
}

export function isAtendente(user: any) {
  return user?.tipo === "ATENDENTE"
}
