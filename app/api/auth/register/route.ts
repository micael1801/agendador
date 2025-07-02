import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { nome, email, senha, especialidades, corAgenda } = await request.json()

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    // Verificar se usuário já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    })

    if (usuarioExistente) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 409 })
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha)

    // Criar usuário e atendente em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar usuário
      const usuario = await tx.usuario.create({
        data: {
          empresaId: 1, // Por enquanto fixo
          nome,
          email,
          senhaHash,
          tipoUsuario: "atendente",
        },
      })

      // Criar atendente
      const atendente = await tx.atendente.create({
        data: {
          usuarioId: usuario.id,
          empresaId: 1,
          nome,
          especialidades: especialidades || [],
          corAgenda: corAgenda || "#3b82f6",
        },
      })

      return { usuario, atendente }
    })

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
      user: {
        id: result.usuario.id,
        nome: result.usuario.nome,
        email: result.usuario.email,
        atendenteId: result.atendente.id,
      },
    })
  } catch (error) {
    console.error("Erro no cadastro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
