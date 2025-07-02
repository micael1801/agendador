import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const servicoId = searchParams.get("servicoId")

    if (!servicoId) {
      return NextResponse.json({ error: "servicoId é obrigatório" }, { status: 400 })
    }

    // Buscar o serviço para obter o nome
    const servico = await prisma.servico.findUnique({
      where: { id: Number.parseInt(servicoId) },
    })

    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }

    // Buscar atendentes que têm especialidade no serviço
    const atendentes = await prisma.atendente.findMany({
      where: {
        ativo: true,
        especialidades: {
          has: servico.nome,
        },
      },
      include: {
        usuario: {
          select: {
            nome: true,
          },
        },
      },
    })

    // Formatar resposta
    const atendentesList = atendentes.map((atendente) => ({
      id: atendente.id,
      nome: atendente.usuario.nome,
      especialidades: atendente.especialidades,
      corAgenda: atendente.corAgenda,
    }))

    return NextResponse.json(atendentesList)
  } catch (error) {
    console.error("Erro ao buscar atendentes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
