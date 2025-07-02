import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { addMinutes } from "@/lib/date-utils"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Dados recebidos:", body)

    const { servicoId, atendenteId, dataAgendamento, horaInicio, clienteData } = body

    // Validar dados obrigatórios
    if (!servicoId || !atendenteId || !dataAgendamento || !horaInicio || !clienteData?.nome || !clienteData?.telefone) {
      console.log("Dados obrigatórios faltando:", { servicoId, atendenteId, dataAgendamento, horaInicio, clienteData })
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Buscar serviço para calcular hora fim e validar
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      console.log("Serviço não encontrado:", servicoId)
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Buscar atendente para validar
    const atendente = await prisma.atendente.findUnique({
      where: { id: Number.parseInt(atendenteId) },
    })

    if (!atendente) {
      console.log("Atendente não encontrado:", atendenteId)
      return NextResponse.json({ error: "Atendente não encontrado" }, { status: 404 })
    }

    const horaFim = addMinutes(horaInicio, servico.duracaoMinutos)
    console.log("Horário calculado:", { horaInicio, horaFim, duracao: servico.duracaoMinutos })

    // Verificar se horário ainda está disponível
    const conflito = await prisma.agendamento.findFirst({
      where: {
        atendenteId: Number.parseInt(atendenteId),
        dataAgendamento: new Date(dataAgendamento + "T00:00:00"),
        status: {
          in: ["agendado", "confirmado"],
        },
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
      },
    })

    if (conflito) {
      console.log("Conflito de horário encontrado:", conflito)
      return NextResponse.json({ error: "Horário não está mais disponível" }, { status: 409 })
    }

    // Buscar ou criar cliente
    let cliente = await prisma.cliente.findFirst({
      where: {
        OR: [{ telefone: clienteData.telefone }, ...(clienteData.email ? [{ email: clienteData.email }] : [])],
        empresaId: 1,
      },
    })

    if (!cliente) {
      console.log("Criando novo cliente:", clienteData)
      cliente = await prisma.cliente.create({
        data: {
          empresaId: 1,
          nome: clienteData.nome,
          telefone: clienteData.telefone,
          email: clienteData.email || null,
        },
      })
      console.log("Cliente criado:", cliente)
    } else {
      console.log("Cliente existente encontrado:", cliente)
    }

    // Criar agendamento
    const tokenCancelamento = crypto.randomUUID()

    console.log("Criando agendamento com dados:", {
      empresaId: 1,
      clienteId: cliente.id,
      atendenteId: Number.parseInt(atendenteId),
      servicoId: Number.parseInt(servicoId),
      dataAgendamento: new Date(dataAgendamento + "T00:00:00"),
      horaInicio,
      horaFim,
      valor: servico.preco,
      observacoes: clienteData.observacoes || null,
      tokenCancelamento,
      status: "agendado",
    })

    const agendamento = await prisma.agendamento.create({
      data: {
        empresaId: 1,
        clienteId: cliente.id,
        atendenteId: Number.parseInt(atendenteId),
        servicoId: Number.parseInt(servicoId),
        dataAgendamento: new Date(dataAgendamento + "T00:00:00"),
        horaInicio,
        horaFim,
        valor: servico.preco,
        observacoes: clienteData.observacoes || null,
        tokenCancelamento,
        status: "agendado",
      },
      include: {
        cliente: true,
        atendente: true,
        servico: true,
      },
    })

    console.log("Agendamento criado com sucesso:", agendamento)

    // Criar movimentação financeira
    await prisma.movimentacaoFinanceira.create({
      data: {
        empresaId: 1,
        agendamentoId: agendamento.id,
        atendenteId: agendamento.atendenteId,
        tipo: "entrada",
        categoria: "Serviço",
        descricao: `${servico.nome} - ${cliente.nome}`,
        valor: servico.preco,
        dataMovimentacao: new Date(dataAgendamento + "T00:00:00"),
      },
    })

    return NextResponse.json({
      success: true,
      agendamento,
      message: "Agendamento criado com sucesso!",
    })
  } catch (error) {
    console.error("Erro detalhado ao criar agendamento:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        cliente: true,
        atendente: true,
        servico: true,
      },
      orderBy: {
        dataAgendamento: "desc",
      },
      take: 10, // Últimos 10 agendamentos
    })

    return NextResponse.json(agendamentos)
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
