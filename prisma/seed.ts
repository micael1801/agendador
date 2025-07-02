import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Limpar dados existentes na ordem correta (devido às foreign keys)
  await prisma.agendamento.deleteMany()
  await prisma.atendente.deleteMany()
  await prisma.servico.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.empresa.deleteMany()

  console.log("🗑️ Dados existentes removidos")

  // Criar empresa
  const empresa = await prisma.empresa.create({
    data: {
      nome: "Salão Exemplo",
      slogan: "Beleza todo dia",
      logoUrl: null,
      telefone: "(11) 99999-0000",
      whatsapp: "(11) 98888-0000",
      email: "contato@salao.com",
      endereco: "Rua Exemplo, 123",
      corPrincipal: "#ec4899",
      corSecundaria: "#9333ea",
    },
  })

  // Criar usuários
  const adminPassword = await bcrypt.hash("123456", 10)
  const mariaPassword = await bcrypt.hash("123456", 10)
  const anaPassword = await bcrypt.hash("123456", 10)

  const admin = await prisma.usuario.create({
    data: {
      nome: "Administrador",
      email: "admin@salao.com",
      senha: adminPassword,
      tipo: "ADMIN",
      empresaId: empresa.id,
    },
  })

  const maria = await prisma.usuario.create({
    data: {
      nome: "Maria Silva",
      email: "maria@salao.com",
      senha: mariaPassword,
      tipo: "ATENDENTE",
      empresaId: empresa.id,
    },
  })

  const ana = await prisma.usuario.create({
    data: {
      nome: "Ana Santos",
      email: "ana@salao.com",
      senha: anaPassword,
      tipo: "ATENDENTE",
      empresaId: empresa.id,
    },
  })

  console.log("👥 Usuários criados")

  // Criar serviços
  const corte = await prisma.servico.create({
    data: {
      nome: "Corte de Cabelo",
      descricao: "Corte moderno e estiloso",
      duracaoMinutos: 60,
      preco: 50.0,
      empresaId: empresa.id,
    },
  })

  const escova = await prisma.servico.create({
    data: {
      nome: "Escova",
      descricao: "Escova modeladora para todos os tipos de cabelo",
      duracaoMinutos: 45,
      preco: 35.0,
      empresaId: empresa.id,
    },
  })

  const manicure = await prisma.servico.create({
    data: {
      nome: "Manicure",
      descricao: "Cuidado completo para as unhas das mãos",
      duracaoMinutos: 60,
      preco: 25.0,
      empresaId: empresa.id,
    },
  })

  const pedicure = await prisma.servico.create({
    data: {
      nome: "Pedicure",
      descricao: "Cuidado completo para as unhas dos pés",
      duracaoMinutos: 60,
      preco: 30.0,
      empresaId: empresa.id,
    },
  })

  const coloracao = await prisma.servico.create({
    data: {
      nome: "Coloração",
      descricao: "Coloração profissional com produtos de qualidade",
      duracaoMinutos: 120,
      preco: 80.0,
      empresaId: empresa.id,
    },
  })

  console.log("💄 Serviços criados")

  // Criar atendentes
  const atendenteMariaData = await prisma.atendente.create({
    data: {
      usuarioId: maria.id,
      empresaId: empresa.id,
      nome: "Maria Silva",
      especialidades: ["Corte de Cabelo", "Escova", "Coloração"],
      corAgenda: "#FF6B6B",
      ativo: true,
    },
  })

  const atendenteAnaData = await prisma.atendente.create({
    data: {
      usuarioId: ana.id,
      empresaId: empresa.id,
      nome: "Ana Santos",
      especialidades: ["Manicure", "Pedicure"],
      corAgenda: "#4ECDC4",
      ativo: true,
    },
  })

  console.log("💅 Atendentes criados")

  // Criar alguns agendamentos de exemplo
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(hoje.getDate() + 1)

  await prisma.agendamento.create({
    data: {
      empresaId: empresa.id,
      clienteId: 1, // Ajuste conforme seu modelo de clientes, se necessário
      atendenteId: atendenteMariaData.id,
      servicoId: corte.id,
      clienteNome: "João Silva",
      clienteTelefone: "(11) 99999-1111",
      clienteEmail: "joao@email.com",
      clienteObs: "",
      dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 9, 0),
      status: "CONFIRMADO",
    },
  })

  await prisma.agendamento.create({
    data: {
      empresaId: empresa.id,
      clienteId: 1, // Ajuste conforme seu modelo de clientes, se necessário
      atendenteId: atendenteAnaData.id,
      servicoId: manicure.id,
      clienteNome: "Maria Oliveira",
      clienteTelefone: "(11) 99999-2222",
      clienteEmail: "maria.oliveira@email.com",
      clienteObs: "",
      dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 0),
      status: "CONFIRMADO",
    },
  })

  console.log("📅 Agendamentos de exemplo criados")
  console.log("✅ Seed concluído com sucesso!")

  console.log("\n🔑 Credenciais de acesso:")
  console.log("Admin: admin@salao.com / 123456")
  console.log("Maria: maria@salao.com / 123456")
  console.log("Ana: ana@salao.com / 123456")
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
