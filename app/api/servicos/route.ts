import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const servicos = await prisma.servico.findMany({
      where: {
        ativo: true,
        empresaId: 1, // Por enquanto usando empresa ID 1
      },
      orderBy: {
        nome: "asc",
      },
    })

    return NextResponse.json(servicos)
  } catch (error) {
    console.error("Erro ao buscar serviços:", error)

    // Retornar dados mockados em caso de erro
    const servicosMock = [
      { id: 1, nome: "Corte Feminino", preco: 45, duracaoMinutos: 45, descricao: "Corte personalizado" },
      { id: 2, nome: "Corte Masculino", preco: 25, duracaoMinutos: 30, descricao: "Corte tradicional" },
      { id: 3, nome: "Coloração", preco: 120, duracaoMinutos: 120, descricao: "Coloração completa" },
      { id: 4, nome: "Escova", preco: 35, duracaoMinutos: 40, descricao: "Escova modeladora" },
      { id: 5, nome: "Hidratação", preco: 60, duracaoMinutos: 60, descricao: "Tratamento hidratante" },
      { id: 6, nome: "Manicure", preco: 20, duracaoMinutos: 30, descricao: "Cuidados para as unhas" },
    ]

    return NextResponse.json(servicosMock)
  }
}
