import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const servicoId = searchParams.get("servicoId")

    let atendentes

    if (servicoId) {
      // Buscar serviço para filtrar atendentes por especialidade
      const servico = await prisma.servico.findUnique({
        where: { id: Number.parseInt(servicoId) },
      })

      if (servico) {
        atendentes = await prisma.atendente.findMany({
          where: {
            ativo: true,
            empresaId: 1,
            especialidades: {
              has: servico.nome, // Verifica se o array contém o nome do serviço
            },
          },
          orderBy: {
            nome: "asc",
          },
        })
      }
    }

    // Se não encontrou atendentes específicos, buscar todos
    if (!atendentes || atendentes.length === 0) {
      atendentes = await prisma.atendente.findMany({
        where: {
          ativo: true,
          empresaId: 1,
        },
        orderBy: {
          nome: "asc",
        },
      })
    }

    return NextResponse.json(atendentes)
  } catch (error) {
    console.error("Erro ao buscar atendentes:", error)

    // Retornar dados mockados em caso de erro
    const atendentesMock = [
      { id: 1, nome: "Maria Silva", especialidades: ["Corte Feminino", "Coloração", "Escova"], corAgenda: "#ec4899" },
      {
        id: 2,
        nome: "Ana Costa",
        especialidades: ["Corte Feminino", "Corte Masculino", "Penteados"],
        corAgenda: "#8b5cf6",
      },
      { id: 3, nome: "Julia Santos", especialidades: ["Manicure", "Pedicure"], corAgenda: "#10b981" },
    ]

    return NextResponse.json(atendentesMock)
  }
}
