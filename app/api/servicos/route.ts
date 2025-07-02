import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const servicos = await prisma.servico.findMany({
      where: {
        ativo: true,
        empresaId: 1, // Por enquanto usando empresa fixa
      },
      orderBy: {
        nome: "asc",
      },
    })

    // Converter Decimal para number para serialização JSON
    const servicosFormatted = servicos.map((servico) => ({
      ...servico,
      preco: Number(servico.preco),
    }))

    return NextResponse.json(servicosFormatted)
  } catch (error) {
    console.error("Erro ao buscar serviços:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
