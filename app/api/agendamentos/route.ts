import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { addMinutes, format } from "date-fns"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const atendenteId = searchParams.get("atendenteId")

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Datas de início e fim são obrigatórias" }, { status: 400 })
    }

    const whereClause: any = {
      dataAgendamento: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      empresaId: 1,
    }

    if (atendenteId && atendenteId !== "todos") {
      whereClause.atendenteId = Number.parseInt(atendenteId)
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: whereClause,
      include: {
        cliente: {
          select: {
            nome: true,
            telefone: true,
            email: true,
          },
        },
        atendente: {
          select: {
            id: true,
            nome: true,
            corAgenda: true,
          },
        },
        servico: {
          select: {
            nome: true,
            duracaoMinutos: true,
          },
        },
      },
      orderBy: [{ dataAgendamento: "asc" }, { horaInicio: "asc" }],
    })

    // Converter Decimal para number
    const agendamentosFormatted = agendamentos.map((agendamento) => ({
      ...agendamento,
      valor: Number(agendamento.valor),
      dataAgendamento: agendamento.dataAgendamento.toISOString().split("T")[0],
    }))

    return NextResponse.json(agendamentosFormatted)
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { servicoId, atendenteId, dataAgendamento, horaInicio, clienteData } = body

    // Validar dados obrigatórios
    if (!servicoId || !atendenteId || !dataAgendamento || !horaInicio || !clienteData.nome || !clienteData.telefone) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Buscar informações do serviço
    const servico = await prisma.servico.findUnique({
      where: { id: servicoId },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Calcular hora de fim baseada na duração do serviço
    const [hora, minuto] = horaInicio.split(":").map(Number)
    const dataHoraInicio = new Date(dataAgendamento + "T" + horaInicio + ":00")
    const dataHoraFim = addMinutes(dataHoraInicio, servico.duracaoMinutos)
    const horaFim = format(dataHoraFim, "HH:mm")

    // Verificar se já existe agendamento no mesmo horário
    const agendamentoExistente = await prisma.agendamento.findFirst({
      where: {
        atendenteId: atendenteId,
        dataAgendamento: new Date(dataAgendamento),
        OR: [
          {
            AND: [{ horaInicio: { lte: horaInicio } }, { horaFim: { gt: horaInicio } }],
          },
          {
            AND: [{ horaInicio: { lt: horaFim } }, { horaFim: { gte: horaFim } }],
          },
          {
            AND: [{ horaInicio: { gte: horaInicio } }, { horaFim: { lte: horaFim } }],
          },
        ],
        status: { not: "cancelado" },
      },
    })

    if (agendamentoExistente) {
      return NextResponse.json({ error: "Horário não disponível" }, { status: 409 })
    }

    // Criar ou encontrar cliente
    let cliente = await prisma.cliente.findFirst({
      where: {
        telefone: clienteData.telefone,
        empresaId: 1,
      },
    })

    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          empresaId: 1,
          nome: clienteData.nome,
          telefone: clienteData.telefone,
          email: clienteData.email || null,
          observacoes: clienteData.observacoes || null,
        },
      })
    }

    // Gerar token para cancelamento
    const tokenCancelamento = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Criar agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        empresaId: 1,
        clienteId: cliente.id,
        atendenteId: atendenteId,
        servicoId: servicoId,
        dataAgendamento: new Date(dataAgendamento),
        horaInicio: horaInicio,
        horaFim: horaFim,
        valor: servico.preco,
        observacoes: clienteData.observacoes || null,
        tokenCancelamento: tokenCancelamento,
        status: "agendado",
      },
      include: {
        cliente: true,
        atendente: true,
        servico: true,
      },
    })

    // Criar movimentação financeira
    await prisma.movimentacaoFinanceira.create({
      data: {
        empresaId: 1,
        agendamentoId: agendamento.id,
        atendenteId: atendenteId,
        tipo: "entrada",
        categoria: "Serviço",
        descricao: `${servico.nome} - ${cliente.nome}`,
        valor: servico.preco,
        dataMovimentacao: new Date(dataAgendamento),
      },
    })

    return NextResponse.json({
      success: true,
      agendamento: {
        id: agendamento.id,
        tokenCancelamento: agendamento.tokenCancelamento,
      },
    })
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
