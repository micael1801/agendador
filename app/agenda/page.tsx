"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Phone } from "lucide-react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Agendamento {
  id: number
  dataAgendamento: string
  horaInicio: string
  horaFim: string
  status: string
  valor: number
  observacoes?: string
  cliente: {
    nome: string
    telefone?: string
    email?: string
  }
  atendente: {
    id: number
    nome: string
    corAgenda: string
  }
  servico: {
    nome: string
    duracaoMinutos: number
  }
}

interface Atendente {
  id: number
  nome: string
  corAgenda: string
}

export default function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [atendentes, setAtendentes] = useState<Atendente[]>([])
  const [selectedAtendente, setSelectedAtendente] = useState<string>("todos")
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAtendentes()
    loadAgendamentos()
  }, [currentWeek, selectedAtendente])

  const loadAtendentes = async () => {
    try {
      const response = await fetch("/api/atendentes")
      if (response.ok) {
        const data = await response.json()
        setAtendentes(data)
      }
    } catch (error) {
      console.error("Erro ao carregar atendentes:", error)
    }
  }

  const loadAgendamentos = async () => {
    try {
      setLoading(true)
      const startDate = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), "yyyy-MM-dd")
      const endDate = format(endOfWeek(currentWeek, { weekStartsOn: 1 }), "yyyy-MM-dd")

      let url = `/api/agendamentos?startDate=${startDate}&endDate=${endDate}`
      if (selectedAtendente !== "todos") {
        url += `&atendenteId=${selectedAtendente}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setAgendamentos(data)
      }
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 }),
  })

  const getAgendamentosForDay = (day: Date) => {
    return agendamentos.filter((agendamento) => isSameDay(new Date(agendamento.dataAgendamento), day))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado":
        return "bg-blue-100 text-blue-800"
      case "confirmado":
        return "bg-green-100 text-green-800"
      case "realizado":
        return "bg-gray-100 text-gray-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      case "faltou":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const previousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7))
  }

  const nextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7))
  }

  const thisWeek = () => {
    setCurrentWeek(new Date())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
              <p className="text-gray-600">Visualize e gerencie os agendamentos</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedAtendente} onValueChange={setSelectedAtendente}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por atendente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os atendentes</SelectItem>
                  {atendentes.map((atendente) => (
                    <SelectItem key={atendente.id} value={atendente.id.toString()}>
                      {atendente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Controles da semana */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={previousWeek} variant="outline">
              ← Semana anterior
            </Button>
            <Button onClick={thisWeek} variant="outline">
              Esta semana
            </Button>
            <Button onClick={nextWeek} variant="outline">
              Próxima semana →
            </Button>
          </div>
          <h2 className="text-xl font-semibold">
            {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), "dd/MM", { locale: ptBR })} -{" "}
            {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), "dd/MM/yyyy", { locale: ptBR })}
          </h2>
        </div>

        {/* Grade da semana */}
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayAgendamentos = getAgendamentosForDay(day)
            const isToday = isSameDay(day, new Date())

            return (
              <Card key={day.toISOString()} className={`${isToday ? "ring-2 ring-pink-500" : ""}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{format(day, "EEEE", { locale: ptBR })}</CardTitle>
                  <CardDescription className="text-lg font-semibold">
                    {format(day, "dd/MM", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600 mx-auto"></div>
                    </div>
                  ) : dayAgendamentos.length > 0 ? (
                    dayAgendamentos
                      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                      .map((agendamento) => (
                        <div
                          key={agendamento.id}
                          className="p-3 rounded-lg border-l-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                          style={{ borderLeftColor: agendamento.atendente.corAgenda }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {agendamento.horaInicio} - {agendamento.horaFim}
                            </span>
                            <Badge className={`text-xs ${getStatusColor(agendamento.status)}`}>
                              {agendamento.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <User className="w-3 h-3 mr-1" />
                              <span className="font-medium">{agendamento.cliente.nome}</span>
                            </div>
                            <div className="text-xs text-gray-600">{agendamento.servico.nome}</div>
                            <div className="text-xs text-gray-500">{agendamento.atendente.nome}</div>
                            {agendamento.cliente.telefone && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Phone className="w-3 h-3 mr-1" />
                                {agendamento.cliente.telefone}
                              </div>
                            )}
                            <div className="text-xs font-medium text-green-600">R$ {agendamento.valor.toFixed(2)}</div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum agendamento</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Resumo do dia */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo da Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total de agendamentos:</span>
                  <span className="font-medium">{agendamentos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmados:</span>
                  <span className="font-medium text-green-600">
                    {agendamentos.filter((a) => a.status === "confirmado").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pendentes:</span>
                  <span className="font-medium text-blue-600">
                    {agendamentos.filter((a) => a.status === "agendado").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cancelados:</span>
                  <span className="font-medium text-red-600">
                    {agendamentos.filter((a) => a.status === "cancelado").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Faturamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total previsto:</span>
                  <span className="font-medium text-green-600">
                    R${" "}
                    {agendamentos
                      .filter((a) => a.status !== "cancelado")
                      .reduce((sum, a) => sum + a.valor, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Realizado:</span>
                  <span className="font-medium">
                    R${" "}
                    {agendamentos
                      .filter((a) => a.status === "realizado")
                      .reduce((sum, a) => sum + a.valor, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {agendamentos
                  .filter((a) => new Date(a.dataAgendamento + "T" + a.horaInicio) > new Date())
                  .sort(
                    (a, b) =>
                      new Date(a.dataAgendamento + "T" + a.horaInicio).getTime() -
                      new Date(b.dataAgendamento + "T" + b.horaInicio).getTime(),
                  )
                  .slice(0, 3)
                  .map((agendamento) => (
                    <div key={agendamento.id} className="text-sm">
                      <div className="font-medium">{agendamento.cliente.nome}</div>
                      <div className="text-gray-500">
                        {format(new Date(agendamento.dataAgendamento), "dd/MM", { locale: ptBR })} às{" "}
                        {agendamento.horaInicio}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
