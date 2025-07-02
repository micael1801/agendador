import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const servicos = await prisma.servico.findMany({
      where: {
        ativo: true,
        empresaId: 1, // Por enquanto fixo, depois implementar multi-tenant
      },
      orderBy: {
        nome: "asc",
      },
    })

    return NextResponse.json(servicos)
  } catch (error) {
    console.error("Erro ao buscar serviços:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
