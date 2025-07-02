import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const atendenteId = searchParams.get("atendenteId")
    const data = searchParams.get("data")
    const servicoId = searchParams.get("servicoId")

    if (!atendenteId || !data || !servicoId) {
      return NextResponse.json({ error: "Parâmetros obrigatórios: atendenteId, data, servicoId" }, { status: 400 })
    }

    // Buscar o serviço para obter a duração
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Converter a data para o início e fim do dia
    const dataInicio = new Date(data + "T00:00:00")
    const dataFim = new Date(data + "T23:59:59")

    // Buscar agendamentos existentes para o atendente na data
    const agendamentosExistentes = await prisma.agendamento.findMany({
      where: {
        atendenteId: Number.parseInt(atendenteId),
        dataHora: {
          gte: dataInicio,
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

    // Gerar horários disponíveis (8h às 18h, intervalos de 30 min)
    const horariosDisponiveis = []
    const horaInicio = 8 // 8h
    const horaFim = 18 // 18h
    const intervalo = 30 // 30 minutos

    for (let hora = horaInicio; hora < horaFim; hora++) {
      for (let minuto = 0; minuto < 60; minuto += intervalo) {
        const horarioString = `${hora.toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")}`

        // Verificar se o horário está ocupado
        const horarioDateTime = new Date(data + `T${horarioString}:00`)
        const duracaoServicoMinutos = servico.duracaoMinutos

        let ocupado = false

        for (const agendamento of agendamentosExistentes) {
          const inicioAgendamento = new Date(agendamento.dataHora)
          const fimAgendamento = new Date(inicioAgendamento.getTime() + agendamento.servico.duracaoMinutos * 60000)
          const fimNovoAgendamento = new Date(horarioDateTime.getTime() + duracaoServicoMinutos * 60000)

          // Verificar sobreposição
          if (
            (horarioDateTime >= inicioAgendamento && horarioDateTime < fimAgendamento) ||
            (fimNovoAgendamento > inicioAgendamento && fimNovoAgendamento <= fimAgendamento) ||
            (horarioDateTime <= inicioAgendamento && fimNovoAgendamento >= fimAgendamento)
          ) {
            ocupado = true
            break
          }
        }

        // Verificar se não é no passado
        const agora = new Date()
        const isPassado = horarioDateTime <= agora

        horariosDisponiveis.push({
          time: horarioString,
          available: !ocupado && !isPassado,
        })
      }
    }

    return NextResponse.json(horariosDisponiveis)
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
