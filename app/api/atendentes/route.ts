import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const servicoId = searchParams.get("servicoId")

    let atendentes = await prisma.atendente.findMany({
      where: {
        ativo: true,
        empresaId: 1, // Por enquanto fixo
      },
      orderBy: {
        nome: "asc",
      },
    })

    // Se um serviço foi especificado, filtrar atendentes que fazem esse serviço
    if (servicoId) {
      const servico = await prisma.servico.findUnique({
        where: { id: Number.parseInt(servicoId) },
      })

      if (servico) {
        atendentes = atendentes.filter((atendente) => atendente.especialidades.includes(servico.nome))
      }
    }

    return NextResponse.json(atendentes)
  } catch (error) {
    console.error("Erro ao buscar atendentes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
