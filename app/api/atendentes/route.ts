import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const servicoId = searchParams.get("servicoId")

    let atendentes

    if (servicoId) {
      // Buscar o serviço para saber qual especialidade é necessária
      const servico = await prisma.servico.findUnique({
        where: { id: Number.parseInt(servicoId) },
      })

      if (!servico) {
        return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
      }

      // Buscar atendentes que tenham a especialidade necessária
      atendentes = await prisma.atendente.findMany({
        where: {
          ativo: true,
          // Filtrar por especialidades que contenham o nome do serviço ou palavras relacionadas
          OR: [
            {
              especialidades: {
                has: servico.nome,
              },
            },
            {
              especialidades: {
                hasSome: ["Corte", "Escova", "Coloração", "Manicure", "Pedicure"],
              },
            },
          ],
        },
        include: {
          usuario: {
            select: {
              nome: true,
            },
          },
        },
        orderBy: {
          usuario: {
            nome: "asc",
          },
        },
      })
    } else {
      // Buscar todos os atendentes ativos
      atendentes = await prisma.atendente.findMany({
        where: {
          ativo: true,
        },
        include: {
          usuario: {
            select: {
              nome: true,
            },
          },
        },
        orderBy: {
          usuario: {
            nome: "asc",
          },
        },
      })
    }

    // Formatar os dados para o frontend
    const atendentesFormatted = atendentes.map((atendente) => ({
      id: atendente.id,
      nome: atendente.usuario.nome,
      especialidades: atendente.especialidades,
      corAgenda: atendente.corAgenda,
    }))

    return NextResponse.json(atendentesFormatted)
  } catch (error) {
    console.error("Erro ao buscar atendentes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioId, especialidades, corAgenda } = body

    // Validações básicas
    if (!usuarioId || !especialidades || !Array.isArray(especialidades)) {
      return NextResponse.json({ error: "usuarioId e especialidades (array) são obrigatórios" }, { status: 400 })
    }

    // Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    })

    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const atendente = await prisma.atendente.create({
      data: {
        usuarioId,
        especialidades,
        corAgenda: corAgenda || "#3b82f6",
        ativo: true,
      },
      include: {
        usuario: {
          select: {
            nome: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        id: atendente.id,
        nome: atendente.usuario.nome,
        especialidades: atendente.especialidades,
        corAgenda: atendente.corAgenda,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar atendente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
