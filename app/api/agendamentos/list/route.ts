import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
