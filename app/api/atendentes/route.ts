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
      },
      orderBy: {
        usuario: {
          nome: "asc",
        },
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
    const { usuarioId, especialidades, corAgenda } = body

    if (!usuarioId || !especialidades) {
      return NextResponse.json({ error: "Usuario ID e especialidades são obrigatórios" }, { status: 400 })
    }

    const atendente = await prisma.atendente.create({
      data: {
        usuarioId: Number.parseInt(usuarioId),
        especialidades,
        corAgenda: corAgenda || "#3b82f6",
      },
      include: {
        usuario: {
          select: {
            nome: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(atendente, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar atendente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
