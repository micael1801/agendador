import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const atendenteId = searchParams.get("atendenteId")

    const whereClause: any = {}

    if (startDate && endDate) {
      whereClause.dataAgendamento = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
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
            cor: true,
            duracaoMinutos: true,
          },
        },
      },
      orderBy: [{ dataAgendamento: "asc" }, { horaInicio: "asc" }],
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
    const {
      clienteNome,
      clienteTelefone,
      clienteEmail,
      servicoId,
      atendenteId,
      dataAgendamento,
      horaInicio,
      observacoes,
    } = body

    // Validações básicas
    if (!clienteNome || !clienteTelefone || !servicoId || !atendenteId || !dataAgendamento || !horaInicio) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Buscar o serviço para calcular hora fim e valor
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Calcular hora fim
    const [hora, minuto] = horaInicio.split(":").map(Number)
    const inicioMinutos = hora * 60 + minuto
    const fimMinutos = inicioMinutos + servico.duracaoMinutos
    const horaFim = `${Math.floor(fimMinutos / 60)
      .toString()
      .padStart(2, "0")}:${(fimMinutos % 60).toString().padStart(2, "0")}`

    // Verificar conflitos de horário
    const conflito = await prisma.agendamento.findFirst({
      where: {
        atendenteId: Number.parseInt(atendenteId),
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

    if (conflito) {
      return NextResponse.json({ error: "Já existe um agendamento neste horário" }, { status: 409 })
    }

    // Buscar primeira empresa (assumindo single-tenant)
    const empresa = await prisma.empresa.findFirst()
    if (!empresa) {
      return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 })
    }

    // Criar ou buscar cliente
    let cliente = await prisma.cliente.findFirst({
      where: {
        telefone: clienteTelefone,
        empresaId: empresa.id,
      },
    })

    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          empresaId: empresa.id,
          nome: clienteNome,
          telefone: clienteTelefone,
          email: clienteEmail,
        },
      })
    }

    // Criar agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        empresaId: empresa.id,
        clienteId: cliente.id,
        atendenteId: Number.parseInt(atendenteId),
        servicoId: Number.parseInt(servicoId),
        dataAgendamento: new Date(dataAgendamento),
        horaInicio,
        horaFim,
        valor: servico.preco,
        observacoes,
        status: "agendado",
      },
      include: {
        cliente: true,
        atendente: true,
        servico: true,
      },
    })

    return NextResponse.json({
      success: true,
      agendamento,
    })
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
