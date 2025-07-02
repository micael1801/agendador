import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Limpar dados existentes
  await prisma.movimentacaoFinanceira.deleteMany()
  await prisma.agendamento.deleteMany()
  await prisma.bloqueio.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.servico.deleteMany()
  await prisma.horarioAtendente.deleteMany()
  await prisma.atendente.deleteMany()
  await prisma.horarioFuncionamento.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.empresa.deleteMany()

  // Criar empresa
  const empresa = await prisma.empresa.create({
    data: {
      nome: "Salão Exemplo",
      slogan: "Beleza e bem-estar em primeiro lugar",
      telefone: "(11) 99999-9999",
      whatsapp: "(11) 99999-9999",
      email: "contato@salaoexemplo.com",
      endereco: "Rua das Flores, 123 - Centro",
      corPrincipal: "#ec4899",
      corSecundaria: "#9333ea",
    },
  })

  console.log("✅ Empresa criada:", empresa.nome)

  // Criar horários de funcionamento
  const diasSemana = [
    { dia: 1, inicio: "08:00", fim: "18:00" }, // Segunda
    { dia: 2, inicio: "08:00", fim: "18:00" }, // Terça
    { dia: 3, inicio: "08:00", fim: "18:00" }, // Quarta
    { dia: 4, inicio: "08:00", fim: "18:00" }, // Quinta
    { dia: 5, inicio: "08:00", fim: "18:00" }, // Sexta
    { dia: 6, inicio: "08:00", fim: "16:00" }, // Sábado
  ]

  for (const horario of diasSemana) {
    await prisma.horarioFuncionamento.create({
      data: {
        empresaId: empresa.id,
        diaSemana: horario.dia,
        horaInicio: horario.inicio,
        horaFim: horario.fim,
        ativo: true,
      },
    })
  }

  console.log("✅ Horários de funcionamento criados")

  // Criar usuário admin
  const senhaHash = await bcrypt.hash("123456", 10)
  const usuarioAdmin = await prisma.usuario.create({
    data: {
      empresaId: empresa.id,
      nome: "Administrador",
      email: "admin@salaoexemplo.com",
      senhaHash,
      tipoUsuario: "admin",
      ativo: true,
    },
  })

  console.log("✅ Usuário admin criado")

  // Criar usuários atendentes
  const usuarioAtendente1 = await prisma.usuario.create({
    data: {
      empresaId: empresa.id,
      nome: "Maria Silva",
      email: "maria@salaoexemplo.com",
      senhaHash: await bcrypt.hash("123456", 10),
      tipoUsuario: "atendente",
      ativo: true,
    },
  })

  const usuarioAtendente2 = await prisma.usuario.create({
    data: {
      empresaId: empresa.id,
      nome: "Ana Santos",
      email: "ana@salaoexemplo.com",
      senhaHash: await bcrypt.hash("123456", 10),
      tipoUsuario: "atendente",
      ativo: true,
    },
  })

  // Criar atendentes
  const atendente1 = await prisma.atendente.create({
    data: {
      usuarioId: usuarioAtendente1.id,
      empresaId: empresa.id,
      nome: "Maria Silva",
      especialidades: ["Corte", "Escova", "Coloração"],
      corAgenda: "#3b82f6",
      ativo: true,
    },
  })

  const atendente2 = await prisma.atendente.create({
    data: {
      usuarioId: usuarioAtendente2.id,
      empresaId: empresa.id,
      nome: "Ana Santos",
      especialidades: ["Manicure", "Pedicure", "Esmaltação"],
      corAgenda: "#10b981",
      ativo: true,
    },
  })

  console.log("✅ Atendentes criados")

  // Criar horários dos atendentes
  const horariosAtendentes = [
    { dia: 1, inicio: "08:00", fim: "17:00" },
    { dia: 2, inicio: "08:00", fim: "17:00" },
    { dia: 3, inicio: "08:00", fim: "17:00" },
    { dia: 4, inicio: "08:00", fim: "17:00" },
    { dia: 5, inicio: "08:00", fim: "17:00" },
    { dia: 6, inicio: "08:00", fim: "15:00" },
  ]

  for (const atendente of [atendente1, atendente2]) {
    for (const horario of horariosAtendentes) {
      await prisma.horarioAtendente.create({
        data: {
          atendenteId: atendente.id,
          diaSemana: horario.dia,
          horaInicio: horario.inicio,
          horaFim: horario.fim,
          ativo: true,
        },
      })
    }
  }

  console.log("✅ Horários dos atendentes criados")

  // Criar serviços
  const servicos = [
    {
      nome: "Corte Feminino",
      descricao: "Corte de cabelo feminino com lavagem e finalização",
      preco: 45.0,
      duracao: 60,
      cor: "#ec4899",
    },
    {
      nome: "Corte Masculino",
      descricao: "Corte de cabelo masculino tradicional",
      preco: 25.0,
      duracao: 30,
      cor: "#3b82f6",
    },
    {
      nome: "Escova",
      descricao: "Escova modeladora com produtos profissionais",
      preco: 35.0,
      duracao: 45,
      cor: "#f59e0b",
    },
    {
      nome: "Coloração",
      descricao: "Coloração completa com produtos de qualidade",
      preco: 80.0,
      duracao: 120,
      cor: "#8b5cf6",
    },
    {
      nome: "Manicure",
      descricao: "Cuidados completos para as unhas das mãos",
      preco: 20.0,
      duracao: 45,
      cor: "#10b981",
    },
    {
      nome: "Pedicure",
      descricao: "Cuidados completos para os pés",
      preco: 25.0,
      duracao: 60,
      cor: "#06b6d4",
    },
  ]

  for (const servico of servicos) {
    await prisma.servico.create({
      data: {
        empresaId: empresa.id,
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco,
        duracaoMinutos: servico.duracao,
        cor: servico.cor,
        ativo: true,
      },
    })
  }

  console.log("✅ Serviços criados")

  // Criar alguns clientes de exemplo
  const clientes = [
    {
      nome: "João Silva",
      telefone: "(11) 98888-8888",
      email: "joao@email.com",
    },
    {
      nome: "Maria Oliveira",
      telefone: "(11) 97777-7777",
      email: "maria@email.com",
    },
    {
      nome: "Pedro Santos",
      telefone: "(11) 96666-6666",
      email: "pedro@email.com",
    },
  ]

  for (const cliente of clientes) {
    await prisma.cliente.create({
      data: {
        empresaId: empresa.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email,
      },
    })
  }

  console.log("✅ Clientes criados")

  console.log("🎉 Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
