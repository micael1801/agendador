import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Limpar dados existentes (opcional - remova se não quiser limpar)
  await prisma.agendamento.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.horarioAtendente.deleteMany()
  await prisma.atendente.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.servico.deleteMany()
  await prisma.horarioFuncionamento.deleteMany()
  await prisma.empresa.deleteMany()

  // Criar empresa
  const empresa = await prisma.empresa.create({
    data: {
      nome: "Salão Exemplo",
      slogan: "Beleza e bem-estar",
      telefone: "(11) 99999-9999",
      whatsapp: "(11) 99999-9999",
      email: "contato@salaoexemplo.com",
      endereco: "Rua das Flores, 123 - Centro",
      corPrincipal: "#ec4899",
      corSecundaria: "#9333ea",
    },
  })

  console.log("✅ Empresa criada:", empresa.nome)

  // Criar serviços
  const servicos = await Promise.all([
    prisma.servico.create({
      data: {
        empresaId: empresa.id,
        nome: "Corte Feminino",
        descricao: "Corte personalizado para mulheres",
        preco: 45.0,
        duracaoMinutos: 45,
        cor: "#ec4899",
      },
    }),
    prisma.servico.create({
      data: {
        empresaId: empresa.id,
        nome: "Corte Masculino",
        descricao: "Corte tradicional masculino",
        preco: 25.0,
        duracaoMinutos: 30,
        cor: "#3b82f6",
      },
    }),
    prisma.servico.create({
      data: {
        empresaId: empresa.id,
        nome: "Coloração",
        descricao: "Coloração completa dos cabelos",
        preco: 120.0,
        duracaoMinutos: 120,
        cor: "#8b5cf6",
      },
    }),
    prisma.servico.create({
      data: {
        empresaId: empresa.id,
        nome: "Escova",
        descricao: "Escova modeladora",
        preco: 35.0,
        duracaoMinutos: 40,
        cor: "#10b981",
      },
    }),
    prisma.servico.create({
      data: {
        empresaId: empresa.id,
        nome: "Hidratação",
        descricao: "Tratamento hidratante para cabelos",
        preco: 60.0,
        duracaoMinutos: 60,
        cor: "#06b6d4",
      },
    }),
    prisma.servico.create({
      data: {
        empresaId: empresa.id,
        nome: "Manicure",
        descricao: "Cuidados para as unhas das mãos",
        preco: 20.0,
        duracaoMinutos: 30,
        cor: "#f59e0b",
      },
    }),
  ])

  console.log("✅ Serviços criados:", servicos.length)

  // Hash da senha padrão (123456)
  const senhaHash = await bcrypt.hash("123456", 12)

  // Criar usuários
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        empresaId: empresa.id,
        nome: "Admin Sistema",
        email: "admin@salao.com",
        senhaHash,
        tipoUsuario: "admin",
      },
    }),
    prisma.usuario.create({
      data: {
        empresaId: empresa.id,
        nome: "Maria Silva",
        email: "maria@salao.com",
        senhaHash,
        tipoUsuario: "atendente",
      },
    }),
    prisma.usuario.create({
      data: {
        empresaId: empresa.id,
        nome: "Ana Costa",
        email: "ana@salao.com",
        senhaHash,
        tipoUsuario: "atendente",
      },
    }),
    prisma.usuario.create({
      data: {
        empresaId: empresa.id,
        nome: "Julia Santos",
        email: "julia@salao.com",
        senhaHash,
        tipoUsuario: "atendente",
      },
    }),
  ])

  console.log("✅ Usuários criados:", usuarios.length)

  // Criar atendentes
  const atendentes = await Promise.all([
    prisma.atendente.create({
      data: {
        usuarioId: usuarios[1].id, // Maria
        empresaId: empresa.id,
        nome: "Maria Silva",
        especialidades: ["Corte Feminino", "Coloração", "Escova"],
        corAgenda: "#ec4899",
      },
    }),
    prisma.atendente.create({
      data: {
        usuarioId: usuarios[2].id, // Ana
        empresaId: empresa.id,
        nome: "Ana Costa",
        especialidades: ["Corte Feminino", "Corte Masculino", "Hidratação"],
        corAgenda: "#8b5cf6",
      },
    }),
    prisma.atendente.create({
      data: {
        usuarioId: usuarios[3].id, // Julia
        empresaId: empresa.id,
        nome: "Julia Santos",
        especialidades: ["Manicure", "Escova"],
        corAgenda: "#10b981",
      },
    }),
  ])

  console.log("✅ Atendentes criados:", atendentes.length)

  // Criar horários de funcionamento
  const diasSemana = [
    { dia: 1, inicio: "08:00", fim: "18:00" }, // Segunda
    { dia: 2, inicio: "08:00", fim: "18:00" }, // Terça
    { dia: 3, inicio: "08:00", fim: "18:00" }, // Quarta
    { dia: 4, inicio: "08:00", fim: "18:00" }, // Quinta
    { dia: 5, inicio: "08:00", fim: "18:00" }, // Sexta
    { dia: 6, inicio: "08:00", fim: "17:00" }, // Sábado
  ]

  for (const horario of diasSemana) {
    await prisma.horarioFuncionamento.create({
      data: {
        empresaId: empresa.id,
        diaSemana: horario.dia,
        horaInicio: horario.inicio,
        horaFim: horario.fim,
      },
    })
  }

  console.log("✅ Horários de funcionamento criados")

  // Criar horários dos atendentes (todos trabalham nos mesmos horários da empresa)
  for (const atendente of atendentes) {
    for (const horario of diasSemana) {
      await prisma.horarioAtendente.create({
        data: {
          atendenteId: atendente.id,
          diaSemana: horario.dia,
          horaInicio: horario.inicio,
          horaFim: horario.fim,
        },
      })
    }
  }

  console.log("✅ Horários dos atendentes criados")

  // Criar alguns clientes de exemplo
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        empresaId: empresa.id,
        nome: "João Silva",
        telefone: "(11) 98888-8888",
        email: "joao@email.com",
      },
    }),
    prisma.cliente.create({
      data: {
        empresaId: empresa.id,
        nome: "Maria Oliveira",
        telefone: "(11) 97777-7777",
        email: "maria@email.com",
      },
    }),
    prisma.cliente.create({
      data: {
        empresaId: empresa.id,
        nome: "Pedro Santos",
        telefone: "(11) 96666-6666",
        email: "pedro@email.com",
      },
    }),
    prisma.cliente.create({
      data: {
        empresaId: empresa.id,
        nome: "Ana Lima",
        telefone: "(11) 95555-5555",
        email: "ana@email.com",
      },
    }),
  ])

  console.log("✅ Clientes criados:", clientes.length)

  // Criar alguns agendamentos de exemplo
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(hoje.getDate() + 1)
  const depoisAmanha = new Date(hoje)
  depoisAmanha.setDate(hoje.getDate() + 2)

  const agendamentos = await Promise.all([
    prisma.agendamento.create({
      data: {
        empresaId: empresa.id,
        clienteId: clientes[0].id,
        atendenteId: atendentes[0].id,
        servicoId: servicos[0].id, // Corte Feminino
        dataAgendamento: hoje,
        horaInicio: "09:00",
        horaFim: "09:45",
        valor: 45.0,
        status: "confirmado",
      },
    }),
    prisma.agendamento.create({
      data: {
        empresaId: empresa.id,
        clienteId: clientes[1].id,
        atendenteId: atendentes[1].id,
        servicoId: servicos[1].id, // Corte Masculino
        dataAgendamento: hoje,
        horaInicio: "10:00",
        horaFim: "10:30",
        valor: 25.0,
        status: "agendado",
      },
    }),
    prisma.agendamento.create({
      data: {
        empresaId: empresa.id,
        clienteId: clientes[2].id,
        atendenteId: atendentes[0].id,
        servicoId: servicos[2].id, // Coloração
        dataAgendamento: hoje,
        horaInicio: "14:00",
        horaFim: "16:00",
        valor: 120.0,
        status: "confirmado",
      },
    }),
    prisma.agendamento.create({
      data: {
        empresaId: empresa.id,
        clienteId: clientes[3].id,
        atendenteId: atendentes[2].id,
        servicoId: servicos[5].id, // Manicure
        dataAgendamento: hoje,
        horaInicio: "15:00",
        horaFim: "15:30",
        valor: 20.0,
        status: "agendado",
      },
    }),
    prisma.agendamento.create({
      data: {
        empresaId: empresa.id,
        clienteId: clientes[0].id,
        atendenteId: atendentes[1].id,
        servicoId: servicos[0].id, // Corte Feminino
        dataAgendamento: amanha,
        horaInicio: "09:00",
        horaFim: "09:45",
        valor: 45.0,
        status: "agendado",
      },
    }),
    prisma.agendamento.create({
      data: {
        empresaId: empresa.id,
        clienteId: clientes[1].id,
        atendenteId: atendentes[0].id,
        servicoId: servicos[3].id, // Escova
        dataAgendamento: amanha,
        horaInicio: "11:00",
        horaFim: "11:40",
        valor: 35.0,
        status: "agendado",
      },
    }),
    prisma.agendamento.create({
      data: {
        empresaId: empresa.id,
        clienteId: clientes[2].id,
        atendenteId: atendentes[2].id,
        servicoId: servicos[5].id, // Manicure
        dataAgendamento: depoisAmanha,
        horaInicio: "10:00",
        horaFim: "10:30",
        valor: 20.0,
        status: "agendado",
      },
    }),
  ])

  console.log("✅ Agendamentos criados:", agendamentos.length)

  console.log("🎉 Seed concluído com sucesso!")
  console.log("\n📋 Resumo:")
  console.log(`- 1 empresa: ${empresa.nome}`)
  console.log(`- ${servicos.length} serviços`)
  console.log(`- ${usuarios.length} usuários`)
  console.log(`- ${atendentes.length} atendentes`)
  console.log(`- ${clientes.length} clientes`)
  console.log(`- ${agendamentos.length} agendamentos`)
  console.log("\n🔑 Credenciais de teste:")
  console.log("- Admin: admin@salao.com / 123456")
  console.log("- Maria: maria@salao.com / 123456")
  console.log("- Ana: ana@salao.com / 123456")
  console.log("- Julia: julia@salao.com / 123456")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("❌ Erro no seed:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
