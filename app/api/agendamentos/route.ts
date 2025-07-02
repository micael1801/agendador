import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get("data")
    const atendenteId = searchParams.get("atendenteId")

    const whereClause: any = {
      status: {
        not: "CANCELADO",
      },
    }

    if (data) {
      const dataInicio = new Date(data)
      dataInicio.setHours(0, 0, 0, 0)

      const dataFim = new Date(data)
      dataFim.setHours(23, 59, 59, 999)

      whereClause.dataHora = {
        gte: dataInicio,
        lte: dataFim,
      }
    }

    if (atendenteId) {
      whereClause.atendenteId = Number.parseInt(atendenteId)
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: whereClause,
      include: {
        servico: true,
        atendente: {
          include: {
            usuario: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: {
        dataHora: "asc",
      },
    })

    return NextResponse.json(agendamentos)
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clienteNome, clienteTelefone, clienteEmail, clienteObs, servicoId, atendenteId, dataHora } = body

    if (!clienteNome || !clienteTelefone || !servicoId || !atendenteId || !dataHora) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Verificar se o horário está disponível
    const dataAgendamento = new Date(dataHora)
    const agendamentoExistente = await prisma.agendamento.findFirst({
      where: {
        atendenteId: Number.parseInt(atendenteId),
        dataHora: dataAgendamento,
        status: {
          not: "CANCELADO",
        },
      },
    })

    if (agendamentoExistente) {
      return NextResponse.json({ error: "Horário não disponível" }, { status: 409 })
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        clienteNome,
        clienteTelefone,
        clienteEmail,
        clienteObs,
        servicoId: Number.parseInt(servicoId),
        atendenteId: Number.parseInt(atendenteId),
        dataHora: dataAgendamento,
        status: "CONFIRMADO",
      },
      include: {
        servico: true,
        atendente: {
          include: {
            usuario: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(agendamento, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
