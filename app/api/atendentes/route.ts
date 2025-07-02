import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const atendentes = await prisma.atendente.findMany({
      where: {
        ativo: true,
      },
      include: {
        usuario: {
          select: {
            nome: true,
            email: true,
          },
        },
        horariosAtendente: {
          where: {
            ativo: true,
          },
        },
      },
      orderBy: {
        nome: "asc",
      },
    })

    return NextResponse.json(atendentes)
  } catch (error) {
    console.error("Erro ao buscar atendentes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, especialidades, corAgenda } = body

    // Validações básicas
    if (!nome || !email) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    // Criar usuário primeiro
    const usuario = await prisma.usuario.create({
      data: {
        empresaId: 1, // Por enquanto fixo
        nome,
        email,
        senhaHash: "temp", // Implementar geração de senha depois
        tipoUsuario: "atendente",
        ativo: true,
      },
    })

    // Criar atendente
    const atendente = await prisma.atendente.create({
      data: {
        usuarioId: usuario.id,
        empresaId: 1,
        nome,
        especialidades: especialidades || [],
        corAgenda: corAgenda || "#3b82f6",
        ativo: true,
      },
    })

    return NextResponse.json(atendente, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar atendente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
