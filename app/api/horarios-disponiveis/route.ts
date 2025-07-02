import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const atendenteId = searchParams.get("atendenteId")
    const data = searchParams.get("data")
    const servicoId = searchParams.get("servicoId")

    if (!atendenteId || !data || !servicoId) {
      return NextResponse.json({ error: "atendenteId, data e servicoId são obrigatórios" }, { status: 400 })
    }

    // Buscar o serviço para saber a duração
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Buscar agendamentos existentes para o atendente na data
    const dataAgendamento = new Date(data + "T00:00:00")
    const dataFim = new Date(data + "T23:59:59")

    const agendamentosExistentes = await prisma.agendamento.findMany({
      where: {
        atendenteId: Number.parseInt(atendenteId),
        dataHora: {
          gte: dataAgendamento,
          lte: dataFim,
        },
        status: {
          not: "CANCELADO",
        },
      },
      include: {
        servico: true,
      },
    })

    // Gerar horários disponíveis (8h às 18h, de 30 em 30 minutos)
    const horariosDisponiveis = []
    const horaInicio = 8 // 8h
    const horaFim = 18 // 18h
    const intervalo = 30 // 30 minutos

    for (let hora = horaInicio; hora < horaFim; hora++) {
      for (let minuto = 0; minuto < 60; minuto += intervalo) {
        const horarioString = `${hora.toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")}`

        // Verificar se o horário está disponível
        const horarioDateTime = new Date(data + `T${horarioString}:00`)
        const horarioFimDateTime = new Date(horarioDateTime.getTime() + servico.duracaoMinutos * 60000)

        // Verificar conflitos com agendamentos existentes
        const temConflito = agendamentosExistentes.some((agendamento) => {
          const agendamentoFim = new Date(agendamento.dataHora.getTime() + agendamento.servico.duracaoMinutos * 60000)

          return (
            (horarioDateTime >= agendamento.dataHora && horarioDateTime < agendamentoFim) ||
            (horarioFimDateTime > agendamento.dataHora && horarioFimDateTime <= agendamentoFim) ||
            (horarioDateTime <= agendamento.dataHora && horarioFimDateTime >= agendamentoFim)
          )
        })

        // Verificar se o horário de fim não ultrapassa o horário de funcionamento
        const horaFimServico = horarioFimDateTime.getHours() + horarioFimDateTime.getMinutes() / 60
        const dentroDoHorario = horaFimServico <= horaFim

        horariosDisponiveis.push({
          time: horarioString,
          available: !temConflito && dentroDoHorario,
        })
      }
    }

    return NextResponse.json(horariosDisponiveis)
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
