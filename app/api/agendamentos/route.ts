import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { servicoId, atendenteId, dataAgendamento, horaInicio, clienteData } = body

    // Validar dados obrigatórios
    if (!servicoId || !atendenteId || !dataAgendamento || !horaInicio || !clienteData?.nome || !clienteData?.telefone) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Criar a data/hora do agendamento
    const dataHora = new Date(`${dataAgendamento}T${horaInicio}:00`)

    // Verificar se o horário ainda está disponível
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
      return NextResponse.json({ error: "Horário não está mais disponível" }, { status: 409 })
    }

    // Criar o agendamento
    const novoAgendamento = await prisma.agendamento.create({
      data: {
        servicoId: Number.parseInt(servicoId),
        atendenteId: Number.parseInt(atendenteId),
        dataHora: dataHora,
        clienteNome: clienteData.nome,
        clienteTelefone: clienteData.telefone,
        clienteEmail: clienteData.email || null,
        clienteObs: clienteData.observacoes || null,
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

    return NextResponse.json({
      success: true,
      agendamento: {
        id: novoAgendamento.id,
        servico: novoAgendamento.servico.nome,
        atendente: novoAgendamento.atendente.usuario.nome,
        dataHora: novoAgendamento.dataHora,
        cliente: novoAgendamento.clienteNome,
        telefone: novoAgendamento.clienteTelefone,
      },
    })
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
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

    const agendamentosFormatados = agendamentos.map((agendamento) => ({
      id: agendamento.id,
      clienteNome: agendamento.clienteNome,
      clienteTelefone: agendamento.clienteTelefone,
      clienteEmail: agendamento.clienteEmail,
      servico: agendamento.servico.nome,
      atendente: agendamento.atendente.usuario.nome,
      dataHora: agendamento.dataHora,
      status: agendamento.status,
      preco: Number(agendamento.servico.preco),
    }))

    return NextResponse.json(agendamentosFormatados)
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
