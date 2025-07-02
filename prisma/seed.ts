import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Criar empresa
  const empresa = await prisma.empresa.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nome: "Salão Exemplo",
      slogan: "Beleza e bem-estar",
      telefone: "(11) 99999-9999",
      whatsapp: "(11) 99999-9999",
      email: "contato@salaoexemplo.com",
      endereco: "Rua das Flores, 123 - Centro",
      corPrimaria: "#ec4899",
      corSecundaria: "#9333ea",
    },
  })

  console.log("✅ Empresa criada")

  // Criar serviços
  const servicos = await Promise.all([
    prisma.servico.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        empresaId: empresa.id,
        nome: "Corte Feminino",
        descricao: "Corte moderno e estiloso",
        preco: 45.0,
        duracaoMinutos: 60,
        cor: "#ec4899",
        ativo: true,
      },
    }),
    prisma.servico.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        empresaId: empresa.id,
        nome: "Corte Masculino",
        descricao: "Corte clássico e moderno",
        preco: 25.0,
        duracaoMinutos: 30,
        cor: "#3b82f6",
        ativo: true,
      },
    }),
    prisma.servico.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        empresaId: empresa.id,
        nome: "Escova",
        descricao: "Escova modeladora",
        preco: 35.0,
        duracaoMinutos: 45,
        cor: "#10b981",
        ativo: true,
      },
    }),
    prisma.servico.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        empresaId: empresa.id,
        nome: "Coloração",
        descricao: "Coloração completa",
        preco: 120.0,
        duracaoMinutos: 120,
        cor: "#f59e0b",
        ativo: true,
      },
    }),
    prisma.servico.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        empresaId: empresa.id,
        nome: "Manicure",
        descricao: "Cuidados com as unhas",
        preco: 20.0,
        duracaoMinutos: 45,
        cor: "#ef4444",
        ativo: true,
      },
    }),
  ])

  console.log("✅ Serviços criados")

  // Criar atendentes
  const atendentes = await Promise.all([
    prisma.atendente.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        empresaId: empresa.id,
        nome: "Maria Silva",
        telefone: "(11) 98888-8888",
        email: "maria@salaoexemplo.com",
        especialidades: ["Corte Feminino", "Escova", "Coloração"],
        corAgenda: "#ec4899",
        ativo: true,
      },
    }),
    prisma.atendente.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        empresaId: empresa.id,
        nome: "Ana Costa",
        telefone: "(11) 97777-7777",
        email: "ana@salaoexemplo.com",
        especialidades: ["Corte Feminino", "Corte Masculino", "Escova"],
        corAgenda: "#3b82f6",
        ativo: true,
      },
    }),
    prisma.atendente.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        empresaId: empresa.id,
        nome: "Julia Santos",
        telefone: "(11) 96666-6666",
        email: "julia@salaoexemplo.com",
        especialidades: ["Manicure", "Coloração"],
        corAgenda: "#10b981",
        ativo: true,
      },
    }),
  ])

  console.log("✅ Atendentes criados")

  // Criar usuários
  const adminPassword = await hashPassword("123456")
  const mariaPassword = await hashPassword("123456")
  const anaPassword = await hashPassword("123456")
  const juliaPassword = await hashPassword("123456")

  const usuarios = await Promise.all([
    prisma.usuario.upsert({
      where: { email: "admin@salao.com" },
      update: {},
      create: {
        empresaId: empresa.id,
        nome: "Administrador",
        email: "admin@salao.com",
        senhaHash: adminPassword,
        tipoUsuario: "admin",
        ativo: true,
      },
    }),
    prisma.usuario.upsert({
      where: { email: "maria@salao.com" },
      update: {},
      create: {
        empresaId: empresa.id,
        nome: "Maria Silva",
        email: "maria@salao.com",
        senhaHash: mariaPassword,
        tipoUsuario: "atendente",
        atendenteId: atendentes[0].id,
        ativo: true,
      },
    }),
    prisma.usuario.upsert({
      where: { email: "ana@salao.com" },
      update: {},
      create: {
        empresaId: empresa.id,
        nome: "Ana Costa",
        email: "ana@salao.com",
        senhaHash: anaPassword,
        tipoUsuario: "atendente",
        atendenteId: atendentes[1].id,
        ativo: true,
      },
    }),
    prisma.usuario.upsert({
      where: { email: "julia@salao.com" },
      update: {},
      create: {
        empresaId: empresa.id,
        nome: "Julia Santos",
        email: "julia@salao.com",
        senhaHash: juliaPassword,
        tipoUsuario: "atendente",
        atendenteId: atendentes[2].id,
        ativo: true,
      },
    }),
  ])

  console.log("✅ Usuários criados")

  // Criar alguns clientes de exemplo
  const clientes = await Promise.all([
    prisma.cliente.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        empresaId: empresa.id,
        nome: "João Silva",
        telefone: "(11) 95555-5555",
        email: "joao@email.com",
      },
    }),
    prisma.cliente.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        empresaId: empresa.id,
        nome: "Carla Oliveira",
        telefone: "(11) 94444-4444",
        email: "carla@email.com",
      },
    }),
  ])

  console.log("✅ Clientes criados")

  // Criar alguns agendamentos de exemplo
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(hoje.getDate() + 1)

  await Promise.all([
    prisma.agendamento.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        empresaId: empresa.id,
        clienteId: clientes[0].id,
        atendenteId: atendentes[0].id,
        servicoId: servicos[0].id,
        dataAgendamento: hoje,
        horaInicio: "09:00",
        horaFim: "10:00",
        valor: servicos[0].preco,
        status: "agendado",
      },
    }),
    prisma.agendamento.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        empresaId: empresa.id,
        clienteId: clientes[1].id,
        atendenteId: atendentes[1].id,
        servicoId: servicos[1].id,
        dataAgendamento: amanha,
        horaInicio: "14:00",
        horaFim: "14:30",
        valor: servicos[1].preco,
        status: "agendado",
      },
    }),
  ])

  console.log("✅ Agendamentos criados")

  console.log("🎉 Seed concluído com sucesso!")
  console.log("\n📋 Credenciais de acesso:")
  console.log("👤 Admin: admin@salao.com / 123456")
  console.log("👤 Maria: maria@salao.com / 123456")
  console.log("👤 Ana: ana@salao.com / 123456")
  console.log("👤 Julia: julia@salao.com / 123456")
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
