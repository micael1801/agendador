import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const servicoId = searchParams.get("servicoId")
    const atendenteId = searchParams.get("atendenteId")
    const data = searchParams.get("data")

    if (!servicoId || !atendenteId || !data) {
      return NextResponse.json({ error: "servicoId, atendenteId e data são obrigatórios" }, { status: 400 })
    }

    // Buscar o serviço para obter a duração
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Buscar agendamentos existentes para o atendente na data
    const dataInicio = new Date(data)
    dataInicio.setHours(0, 0, 0, 0)

    const dataFim = new Date(data)
    dataFim.setHours(23, 59, 59, 999)

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
    })

    // Gerar horários disponíveis (exemplo: 8h às 18h, de 30 em 30 minutos)
    const horariosDisponiveis = []
    const inicioTrabalho = new Date(data)
    inicioTrabalho.setHours(8, 0, 0, 0)

    const fimTrabalho = new Date(data)
    fimTrabalho.setHours(18, 0, 0, 0)

    let horarioAtual = new Date(inicioTrabalho)

    while (horarioAtual < fimTrabalho) {
      const horarioFim = new Date(horarioAtual.getTime() + servico.duracaoMinutos * 60000)

      // Verificar se não há conflito com agendamentos existentes
      const temConflito = agendamentosExistentes.some((agendamento) => {
        const agendamentoFim = new Date(agendamento.dataHora.getTime() + 60 * 60000) // Assumindo 1h por padrão
        return (
          (horarioAtual >= agendamento.dataHora && horarioAtual < agendamentoFim) ||
          (horarioFim > agendamento.dataHora && horarioFim <= agendamentoFim) ||
          (horarioAtual <= agendamento.dataHora && horarioFim >= agendamentoFim)
        )
      })

      if (!temConflito && horarioFim <= fimTrabalho) {
        horariosDisponiveis.push({
          inicio: horarioAtual.toTimeString().slice(0, 5),
          fim: horarioFim.toTimeString().slice(0, 5),
          dataHora: horarioAtual.toISOString(),
        })
      }

      horarioAtual = new Date(horarioAtual.getTime() + 30 * 60000) // Incrementa 30 minutos
    }

    return NextResponse.json(horariosDisponiveis)
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
