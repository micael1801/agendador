import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const servicoId = searchParams.get("servicoId")

    const whereClause: any = {
      ativo: true,
      empresaId: 1, // Por enquanto usando empresa fixa
    }

    // Se um serviço específico foi solicitado, filtrar por especialidade
    if (servicoId) {
      const servico = await prisma.servico.findUnique({
        where: { id: Number.parseInt(servicoId) },
      })

      if (servico) {
        // Filtrar atendentes que têm o serviço em suas especialidades
        whereClause.especialidades = {
          has: servico.nome,
        }
      }
    }

    const atendentes = await prisma.atendente.findMany({
      where: whereClause,
      orderBy: {
        nome: "asc",
      },
    })

    return NextResponse.json(atendentes)
  } catch (error) {
    console.error("Erro ao buscar atendentes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
