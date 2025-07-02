import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/jwt"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas que não precisam de autenticação
  const publicRoutes = ["/", "/login", "/cadastro", "/agendar"]

  // Rotas de API que não precisam de autenticação
  const publicApiRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/servicos",
    "/api/atendentes",
    "/api/horarios-disponiveis",
    "/api/agendamentos",
  ]

  // Se é uma rota pública, permitir acesso
  if (publicRoutes.includes(pathname) || publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar se tem token de autenticação para rotas protegidas
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verificar se o token é válido
    const payload = verifyToken(token)

    // Adicionar informações do usuário aos headers
    const response = NextResponse.next()
    response.headers.set("x-user-id", payload.userId.toString())
    response.headers.set("x-user-email", payload.email)
    response.headers.set("x-user-tipo", payload.tipo)

    return response
  } catch (error) {
    // Token inválido, redirecionar para login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("auth-token")
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
