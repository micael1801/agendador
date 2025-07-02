"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock, User, LogOut } from "lucide-react"
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface Atendente {
  id: number
  nome: string
  corAgenda: string
  especialidades: string[]
}

interface Agendamento {
  id: number
  dataAgendamento: string
  horaInicio: string
  horaFim: string
  status: string
  valor: number
  cliente: {
    nome: string
    telefone: string
  }
  servico: {
    nome: string
    cor: string
  }
  atendente: {
    id: number
    nome: string
    corAgenda: string
  }
}

const horarios = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

const statusColors = {
  agendado: "bg-blue-100 text-blue-800 border-blue-200",
  confirmado: "bg-green-100 text-green-800 border-green-200",
  realizado: "bg-gray-100 text-gray-800 border-gray-200",
  cancelado: "bg-red-100 text-red-800 border-red-200",
  faltou: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function AgendaPage() {
  const [atendentes, setAtendentes] = useState<Atendente[]>([])
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [atendenteSelected, setAtendenteSelected] = useState<string>("todos")
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i))

  useEffect(() => {
    fetchAtendentes()
    fetchAgendamentos()
  }, [currentWeek])

  const fetchAtendentes = async () => {
    try {
      const response = await fetch("/api/atendentes")
      if (response.ok) {
        const data = await response.json()
        setAtendentes(data)
      }
    } catch (error) {
      console.error("Erro ao buscar atendentes:", error)
    }
  }

  const fetchAgendamentos = async () => {
    try {
      const startDate = format(weekStart, "yyyy-MM-dd")
      const endDate = format(addDays(weekStart, 6), "yyyy-MM-dd")

      const response = await fetch(`/api/agendamentos?startDate=${startDate}&endDate=${endDate}`)
      if (response.ok) {
        const data = await response.json()
        setAgendamentos(data)
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const getAgendamentosForDayAndTime = (day: Date, time: string) => {
    return agendamentos.filter((agendamento) => {
      const agendamentoDate = new Date(agendamento.dataAgendamento + "T00:00:00")
      const matchesDay = isSameDay(agendamentoDate, day)
      const matchesTime = agendamento.horaInicio === time
      const matchesAtendente =
        atendenteSelected === "todos" || agendamento.atendente.id.toString() === atendenteSelected

      return matchesDay && matchesTime && matchesAtendente
    })
  }

  const previousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1))
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1))

  const getResumoSemanal = () => {
    const agendamentosFiltrados =
      atendenteSelected === "todos"
        ? agendamentos
        : agendamentos.filter((a) => a.atendente.id.toString() === atendenteSelected)

    const total = agendamentosFiltrados.length
    const confirmados = agendamentosFiltrados.filter((a) => a.status === "confirmado").length
    const realizados = agendamentosFiltrados.filter((a) => a.status === "realizado").length
    const faturamento = agendamentosFiltrados
      .filter((a) => a.status === "realizado")
      .reduce((sum, a) => sum + (a.valor || 0), 0)

    return { total, confirmados, realizados, faturamento }
  }

  const resumo = getResumoSemanal()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando agenda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
            </div>

            <Select value={atendenteSelected} onValueChange={setAtendenteSelected}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar atendente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os atendentes</SelectItem>
                {atendentes.map((atendente) => (
                  <SelectItem key={atendente.id} value={atendente.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: atendente.corAgenda }} />
                      <span>{atendente.nome}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Resumo Semanal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{resumo.total}</div>
              <div className="text-sm text-gray-600">Total de Agendamentos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{resumo.confirmados}</div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{resumo.realizados}</div>
              <div className="text-sm text-gray-600">Realizados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-pink-600">R$ {resumo.faturamento.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Faturamento</div>
            </CardContent>
          </Card>
        </div>

        {/* Navegação da Semana */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button onClick={previousWeek} variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-lg">
                {format(weekStart, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                {format(addDays(weekStart, 6), "dd/MM/yyyy", { locale: ptBR })}
              </CardTitle>
              <Button onClick={nextWeek} variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Grade da Agenda */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left font-medium text-gray-600 w-20">Horário</th>
                    {weekDays.map((day) => (
                      <th key={day.toISOString()} className="p-3 text-center font-medium text-gray-600 min-w-32">
                        <div>{format(day, "EEE", { locale: ptBR })}</div>
                        <div className="text-sm text-gray-500">{format(day, "dd/MM")}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {horarios.map((time) => (
                    <tr key={time} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium text-gray-600 border-r">{time}</td>
                      {weekDays.map((day) => {
                        const agendamentosSlot = getAgendamentosForDayAndTime(day, time)
                        return (
                          <td key={`${day.toISOString()}-${time}`} className="p-1 align-top">
                            <div className="space-y-1">
                              {agendamentosSlot.map((agendamento) => (
                                <div
                                  key={agendamento.id}
                                  className="p-2 rounded-lg text-xs border"
                                  style={{
                                    backgroundColor: agendamento.atendente.corAgenda + "20",
                                    borderColor: agendamento.atendente.corAgenda + "40",
                                  }}
                                >
                                  <div className="font-medium text-gray-900">{agendamento.cliente.nome}</div>
                                  <div className="text-gray-600">{agendamento.servico.nome}</div>
                                  <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>
                                        {agendamento.horaInicio}-{agendamento.horaFim}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${statusColors[agendamento.status as keyof typeof statusColors]}`}
                                    >
                                      {agendamento.status}
                                    </Badge>
                                  </div>
                                  {atendenteSelected === "todos" && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <User className="w-3 h-3" />
                                      <span className="text-xs">{agendamento.atendente.nome}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
