import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Limpar dados existentes
  await prisma.agendamento.deleteMany()
  await prisma.atendente.deleteMany()
  await prisma.servico.deleteMany()
  await prisma.usuario.deleteMany()

  console.log("🗑️ Dados existentes removidos")

  // Criar usuários
  const adminPassword = await bcrypt.hash("123456", 10)
  const mariaPassword = await bcrypt.hash("123456", 10)
  const anaPassword = await bcrypt.hash("123456", 10)
  const juliaPassword = await bcrypt.hash("123456", 10)

  const admin = await prisma.usuario.create({
    data: {
      nome: "Administrador",
      email: "admin@salao.com",
      senha: adminPassword,
      tipo: "ADMIN",
    },
  })

  const maria = await prisma.usuario.create({
    data: {
      nome: "Maria Silva",
      email: "maria@salao.com",
      senha: mariaPassword,
      tipo: "ATENDENTE",
    },
  })

  const ana = await prisma.usuario.create({
    data: {
      nome: "Ana Santos",
      email: "ana@salao.com",
      senha: anaPassword,
      tipo: "ATENDENTE",
    },
  })

  const julia = await prisma.usuario.create({
    data: {
      nome: "Julia Costa",
      email: "julia@salao.com",
      senha: juliaPassword,
      tipo: "ATENDENTE",
    },
  })

  console.log("👥 Usuários criados")

  // Criar serviços
  const corte = await prisma.servico.create({
    data: {
      nome: "Corte de Cabelo",
      duracao: 60,
      preco: 50.0,
    },
  })

  const escova = await prisma.servico.create({
    data: {
      nome: "Escova",
      duracao: 45,
      preco: 35.0,
    },
  })

  const manicure = await prisma.servico.create({
    data: {
      nome: "Manicure",
      duracao: 60,
      preco: 25.0,
    },
  })

  const pedicure = await prisma.servico.create({
    data: {
      nome: "Pedicure",
      duracao: 60,
      preco: 30.0,
    },
  })

  const coloracao = await prisma.servico.create({
    data: {
      nome: "Coloração",
      duracao: 120,
      preco: 80.0,
    },
  })

  console.log("💄 Serviços criados")

  // Criar atendentes
  const atendenteMariaData = await prisma.atendente.create({
    data: {
      usuarioId: maria.id,
      especialidades: ["Corte de Cabelo", "Escova", "Coloração"],
      cor: "#FF6B6B",
    },
  })

  const atendenteAnaData = await prisma.atendente.create({
    data: {
      usuarioId: ana.id,
      especialidades: ["Manicure", "Pedicure"],
      cor: "#4ECDC4",
    },
  })

  const atendenteJuliaData = await prisma.atendente.create({
    data: {
      usuarioId: julia.id,
      especialidades: ["Corte de Cabelo", "Escova", "Manicure"],
      cor: "#45B7D1",
    },
  })

  console.log("💅 Atendentes criados")

  // Criar alguns agendamentos de exemplo
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(hoje.getDate() + 1)

  await prisma.agendamento.create({
    data: {
      clienteNome: "João Silva",
      clienteTelefone: "(11) 99999-1111",
      clienteEmail: "joao@email.com",
      servicoId: corte.id,
      atendenteId: atendenteMariaData.id,
      dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 9, 0),
      status: "CONFIRMADO",
    },
  })

  await prisma.agendamento.create({
    data: {
      clienteNome: "Maria Oliveira",
      clienteTelefone: "(11) 99999-2222",
      clienteEmail: "maria.oliveira@email.com",
      servicoId: manicure.id,
      atendenteId: atendenteAnaData.id,
      dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 0),
      status: "CONFIRMADO",
    },
  })

  await prisma.agendamento.create({
    data: {
      clienteNome: "Ana Costa",
      clienteTelefone: "(11) 99999-3333",
      clienteEmail: "ana.costa@email.com",
      servicoId: escova.id,
      atendenteId: atendenteJuliaData.id,
      dataHora: new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 10, 30),
      status: "CONFIRMADO",
    },
  })

  console.log("📅 Agendamentos de exemplo criados")
  console.log("✅ Seed concluído com sucesso!")

  console.log("\n🔑 Credenciais de acesso:")
  console.log("Admin: admin@salao.com / 123456")
  console.log("Maria: maria@salao.com / 123456")
  console.log("Ana: ana@salao.com / 123456")
  console.log("Julia: julia@salao.com / 123456")
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
