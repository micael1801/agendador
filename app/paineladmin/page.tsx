"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Calendar, Users, Clock, DollarSign, LogOut, Settings, BarChart3, CalendarDays } from "lucide-react"

interface Agendamento {
  id: string
  clienteNome: string
  clienteTelefone: string
  dataHora: string
  status: string
  servico: {
    nome: string
    preco: number
    duracao: number
  }
  atendente: {
    usuario: {
      nome: string
    }
    cor: string
  }
}

export default function PainelAdminPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalAgendamentos: 0,
    agendamentosHoje: 0,
    faturamentoMes: 0,
    atendentesAtivos: 0,
  })
  const router = useRouter()

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      carregarDados()
    }
  }, [mounted])

  const carregarDados = async () => {
    try {
      const response = await fetch("/api/agendamentos")
      if (response.ok) {
        const data = await response.json()
        setAgendamentos(data)

        // Calcular estatísticas
        const hoje = new Date().toDateString()
        const agendamentosHoje = data.filter((ag: Agendamento) => new Date(ag.dataHora).toDateString() === hoje).length

        const faturamentoMes = data
          .filter((ag: Agendamento) => ag.status === "CONFIRMADO")
          .reduce((total: number, ag: Agendamento) => total + ag.servico.preco, 0)

        const atendentesUnicos = new Set(data.map((ag: Agendamento) => ag.atendente.usuario.nome))

        setStats({
          totalAgendamentos: data.length,
          agendamentosHoje: agendamentosHoje,
          faturamentoMes: faturamentoMes,
          atendentesAtivos: atendentesUnicos.size,
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados")
    } finally {
      setCarregando(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("Logout realizado com sucesso!")
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Erro no logout:", error)
      toast.error("Erro ao fazer logout")
    }
  }

  // Função de formatação que evita problemas de hidratação
  const formatarData = (data: string) => {
    if (!mounted) return "" // Evita renderização no servidor

    try {
      const date = new Date(data)
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return data
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMADO":
        return "bg-green-100 text-green-800"
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELADO":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Não renderiza nada até estar montado no cliente
  if (!mounted) {
    return null
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Painel Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push("/agenda")} className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                Ver Agenda
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Agendamentos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAgendamentos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.agendamentosHoje}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Faturamento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats.faturamentoMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Atendentes Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.atendentesAtivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Agendamentos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Agendamentos Recentes
            </CardTitle>
            <CardDescription>Últimos agendamentos realizados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {agendamentos.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum agendamento encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {agendamentos.slice(0, 10).map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: agendamento.atendente.cor }} />
                      <div>
                        <p className="font-medium text-gray-900">{agendamento.clienteNome}</p>
                        <p className="text-sm text-gray-500">
                          {agendamento.servico.nome} • {agendamento.atendente.usuario.nome}
                        </p>
                        <p className="text-sm text-gray-500">{formatarData(agendamento.dataHora)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(agendamento.status)}>{agendamento.status}</Badge>
                      <p className="font-medium text-gray-900">
                        R$ {agendamento.servico.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
