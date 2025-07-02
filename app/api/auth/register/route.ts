import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha, especialidades, corAgenda } = await request.json()

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    // Verificar se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    })

    if (usuarioExistente) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 })
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha)

    // Buscar primeira empresa (assumindo single-tenant por enquanto)
    const empresa = await prisma.empresa.findFirst()
    if (!empresa) {
      return NextResponse.json({ error: "Nenhuma empresa encontrada" }, { status: 400 })
    }

    // Criar usuário e atendente em uma transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Criar usuário
      const usuario = await tx.usuario.create({
        data: {
          empresaId: empresa.id,
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
          empresaId: empresa.id,
          nome,
          especialidades: especialidades || [],
          corAgenda: corAgenda || "#3b82f6",
        },
      })

      return { usuario, atendente }
    })

    return NextResponse.json({
      success: true,
      message: "Atendente cadastrado com sucesso",
      user: {
        id: resultado.usuario.id,
        nome: resultado.usuario.nome,
        email: resultado.usuario.email,
        atendente: resultado.atendente,
      },
    })
  } catch (error) {
    console.error("Erro no cadastro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
