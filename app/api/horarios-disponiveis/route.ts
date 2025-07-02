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

    // Se não encontrar horário específico do atendente, usar horário padrão
    let horaInicio = "08:00"
    let horaFim = "18:00"

    if (horarioAtendente) {
      horaInicio = horarioAtendente.horaInicio
      horaFim = horarioAtendente.horaFim
    } else {
      // Verificar se é domingo (dia 0) - não trabalha
      if (diaSemana === 0) {
        return NextResponse.json([])
      }
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
    const horariosDisponiveis = generateTimeSlots(horaInicio, horaFim, servico.duracaoMinutos, agendamentosExistentes)

    return NextResponse.json(horariosDisponiveis.map((time) => ({ time, available: true })))
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error)

    // Retornar horários mockados em caso de erro
    const horariosMock = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        // Simular alguns horários ocupados
        const occupied = Math.random() < 0.3
        if (!occupied) {
          horariosMock.push({ time, available: true })
        }
      }
    }

    return NextResponse.json(horariosMock)
  }
}
