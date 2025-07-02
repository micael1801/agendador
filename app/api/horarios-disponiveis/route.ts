import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { addMinutes, format, parse } from "date-fns"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const atendenteId = searchParams.get("atendenteId")
    const data = searchParams.get("data")
    const servicoId = searchParams.get("servicoId")

    if (!atendenteId || !data || !servicoId) {
      return NextResponse.json({ error: "Parâmetros obrigatórios não fornecidos" }, { status: 400 })
    }

    // Buscar serviço para saber a duração
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Buscar agendamentos existentes para o atendente na data
    const agendamentosExistentes = await prisma.agendamento.findMany({
      where: {
        atendenteId: Number.parseInt(atendenteId),
        dataAgendamento: new Date(data),
        status: { not: "cancelado" },
      },
      select: {
        horaInicio: true,
        horaFim: true,
      },
    })

    // Gerar horários disponíveis (8h às 18h com intervalos de 30min)
    const slots = []
    const startHour = 8
    const endHour = 18
    const interval = 30 // minutos

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

        // Calcular hora de fim do serviço
        const horaInicio = parse(time, "HH:mm", new Date())
        const horaFim = addMinutes(horaInicio, servico.duracaoMinutos)
        const horaFimStr = format(horaFim, "HH:mm")

        // Verificar se há conflito com agendamentos existentes
        const hasConflict = agendamentosExistentes.some((agendamento) => {
          return (
            (time >= agendamento.horaInicio && time < agendamento.horaFim) ||
            (horaFimStr > agendamento.horaInicio && horaFimStr <= agendamento.horaFim) ||
            (time <= agendamento.horaInicio && horaFimStr >= agendamento.horaFim)
          )
        })

        // Verificar se o serviço não ultrapassa o horário de funcionamento
        const endTime = format(horaFim, "HH:mm")
        const isWithinWorkingHours = endTime <= "18:00"

        slots.push({
          time,
          available: !hasConflict && isWithinWorkingHours,
        })
      }
    }

    return NextResponse.json(slots)
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
