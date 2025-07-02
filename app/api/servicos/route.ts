import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const servicos = await prisma.servico.findMany({
      where: {
        ativo: true,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, descricao, preco, duracaoMinutos, cor } = body

    // Validações básicas
    if (!nome || !preco || !duracaoMinutos) {
      return NextResponse.json({ error: "Nome, preço e duração são obrigatórios" }, { status: 400 })
    }

    const servico = await prisma.servico.create({
      data: {
        empresaId: 1, // Por enquanto fixo, depois implementar multi-tenant
        nome,
        descricao,
        preco: Number.parseFloat(preco),
        duracaoMinutos: Number.parseInt(duracaoMinutos),
        cor: cor || "#10b981",
        ativo: true,
      },
    })

    return NextResponse.json(servico, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar serviço:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
