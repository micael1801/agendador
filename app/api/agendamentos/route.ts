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
      const dataInicio = new Date(data + "T00:00:00")
      const dataFim = new Date(data + "T23:59:59")
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
            usuario: true,
          },
        },
      },
      orderBy: {
        dataHora: "asc",
      },
    })

    const agendamentosFormatted = agendamentos.map((agendamento) => ({
      id: agendamento.id,
      clienteNome: agendamento.clienteNome,
      clienteTelefone: agendamento.clienteTelefone,
      clienteEmail: agendamento.clienteEmail,
      servico: {
        id: agendamento.servico.id,
        nome: agendamento.servico.nome,
        preco: Number(agendamento.servico.preco),
        duracaoMinutos: agendamento.servico.duracaoMinutos,
      },
      atendente: {
        id: agendamento.atendente.id,
        nome: agendamento.atendente.usuario.nome,
        corAgenda: agendamento.atendente.corAgenda,
      },
      dataHora: agendamento.dataHora,
      status: agendamento.status,
      observacoes: agendamento.clienteObs,
    }))

    return NextResponse.json(agendamentosFormatted)
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { servicoId, atendenteId, dataAgendamento, horaInicio, clienteData } = body

    // Validações básicas
    if (!servicoId || !atendenteId || !dataAgendamento || !horaInicio || !clienteData) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    if (!clienteData.nome || !clienteData.telefone) {
      return NextResponse.json({ error: "Nome e telefone do cliente são obrigatórios" }, { status: 400 })
    }

    // Verificar se o serviço existe
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Verificar se o atendente existe
    const atendente = await prisma.atendente.findUnique({
      where: { id: Number.parseInt(atendenteId) },
    })

    if (!atendente) {
      return NextResponse.json({ error: "Atendente não encontrado" }, { status: 404 })
    }

    // Criar o datetime do agendamento
    const dataHora = new Date(`${dataAgendamento}T${horaInicio}:00`)

    // Verificar se já existe um agendamento no mesmo horário
    const agendamentoExistente = await prisma.agendamento.findFirst({
      where: {
        atendenteId: Number.parseInt(atendenteId),
        dataHora: dataHora,
        status: {
          not: "CANCELADO",
        },
      },
    })

    if (agendamentoExistente) {
      return NextResponse.json({ error: "Horário já ocupado" }, { status: 409 })
    }

    // Criar o agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        clienteNome: clienteData.nome,
        clienteTelefone: clienteData.telefone,
        clienteEmail: clienteData.email || null,
        clienteObs: clienteData.observacoes || null,
        servicoId: Number.parseInt(servicoId),
        atendenteId: Number.parseInt(atendenteId),
        dataHora: dataHora,
        status: "CONFIRMADO",
      },
      include: {
        servico: true,
        atendente: {
          include: {
            usuario: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        id: agendamento.id,
        clienteNome: agendamento.clienteNome,
        clienteTelefone: agendamento.clienteTelefone,
        servico: {
          nome: agendamento.servico.nome,
          preco: Number(agendamento.servico.preco),
        },
        atendente: {
          nome: agendamento.atendente.usuario.nome,
        },
        dataHora: agendamento.dataHora,
        status: agendamento.status,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
