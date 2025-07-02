import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { addMinutes } from "@/lib/date-utils"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { servicoId, atendenteId, dataAgendamento, horaInicio, clienteData } = body

    // Validar dados obrigatórios
    if (!servicoId || !atendenteId || !dataAgendamento || !horaInicio || !clienteData.nome || !clienteData.telefone) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Buscar ou criar cliente
    let cliente = await prisma.cliente.findFirst({
      where: {
        OR: [{ telefone: clienteData.telefone }, { email: clienteData.email || "" }],
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
        },
      })
    }

    // Buscar serviço para calcular hora fim
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    const horaFim = addMinutes(horaInicio, servico.duracaoMinutos)

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
      return NextResponse.json({ error: "Horário não está mais disponível" }, { status: 409 })
    }

    // Criar agendamento
    const tokenCancelamento = crypto.randomUUID()

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

    // Aqui você pode adicionar lógica para enviar email/WhatsApp de confirmação

    return NextResponse.json({
      success: true,
      agendamento,
      message: "Agendamento criado com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
