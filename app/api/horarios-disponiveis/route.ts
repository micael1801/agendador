import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateTimeSlots } from "@/lib/date-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const atendenteId = searchParams.get("atendenteId")
    const data = searchParams.get("data")
    const servicoId = searchParams.get("servicoId")

    if (!atendenteId || !data || !servicoId) {
      return NextResponse.json({ error: "Parâmetros obrigatórios: atendenteId, data, servicoId" }, { status: 400 })
    }

    // Buscar horário de funcionamento do atendente para o dia da semana
    const dataObj = new Date(data + "T00:00:00")
    const diaSemana = dataObj.getDay()

    const horarioAtendente = await prisma.horarioAtendente.findFirst({
      where: {
        atendenteId: Number.parseInt(atendenteId),
        diaSemana: diaSemana,
        ativo: true,
      },
    })

    if (!horarioAtendente) {
      return NextResponse.json([]) // Atendente não trabalha neste dia
    }

    // Buscar agendamentos existentes para o dia
    const agendamentosExistentes = await prisma.agendamento.findMany({
      where: {
        atendenteId: Number.parseInt(atendenteId),
        dataAgendamento: new Date(data + "T00:00:00"),
        status: {
          in: ["agendado", "confirmado"],
        },
      },
      select: {
        horaInicio: true,
        horaFim: true,
      },
    })

    // Buscar duração do serviço
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Gerar horários disponíveis
    const horariosDisponiveis = generateTimeSlots(
      horarioAtendente.horaInicio,
      horarioAtendente.horaFim,
      servico.duracaoMinutos,
      agendamentosExistentes,
    )

    return NextResponse.json(horariosDisponiveis.map((time) => ({ time, available: true })))
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
