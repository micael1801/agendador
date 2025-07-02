import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/jwt"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas que precisam de autenticação
  const protectedRoutes = ["/agenda", "/paineladmin"]

  // Rotas que só podem ser acessadas sem autenticação
  const authRoutes = ["/login", "/cadastro"]

  const token = request.cookies.get("auth-token")?.value

  // Verificar se a rota precisa de autenticação
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Verificar se o token é válido
    const payload = verifyToken(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }
  }

  // Redirecionar usuários autenticados das páginas de auth
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      const payload = verifyToken(token)
      if (payload) {
        // Redirecionar baseado no tipo de usuário
        const redirectUrl = payload.tipoUsuario === "admin" ? "/paineladmin" : "/agenda"
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
