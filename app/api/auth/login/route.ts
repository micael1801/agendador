import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword } from "@/lib/auth"
import { signToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, senha } = body

    console.log("Tentativa de login:", { email })

    if (!email || !senha) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        atendente: true,
      },
    })

    console.log("Usuário encontrado:", usuario ? "Sim" : "Não")

    if (!usuario) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar se usuário está ativo
    if (!usuario.ativo) {
      return NextResponse.json({ error: "Usuário inativo" }, { status: 401 })
    }

    // Verificar senha
    const senhaValida = await comparePassword(senha, usuario.senhaHash)
    console.log("Senha válida:", senhaValida)

    if (!senhaValida) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar token JWT
    const token = signToken({
      userId: usuario.id,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      empresaId: usuario.empresaId,
    })

    console.log("Token gerado com sucesso")

    // Criar resposta com cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
        atendente: usuario.atendente,
      },
    })

    // Definir cookie seguro
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
