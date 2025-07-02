"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Clock, User } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface Servico {
  id: number
  nome: string
  descricao: string
  preco: number
  duracaoMinutos: number
}

interface Atendente {
  id: number
  nome: string
  especialidades: string[]
  corAgenda: string
}

interface HorarioDisponivel {
  time: string
  available: boolean
}

export default function AgendarPage() {
  const [step, setStep] = useState(1)
  const [servicos, setServicos] = useState<Servico[]>([])
  const [atendentes, setAtendentes] = useState<Atendente[]>([])
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([])
  const [loading, setLoading] = useState(false)

  // Estados do formulário
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null)
  const [atendenteSelecionado, setAtendenteSelecionado] = useState<Atendente | null>(null)
  const [dataSelecionada, setDataSelecionada] = useState<Date>()
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>("")
  const [clienteData, setClienteData] = useState({
    nome: "",
    telefone: "",
    email: "",
    observacoes: "",
  })

  // Carregar serviços
  useEffect(() => {
    const carregarServicos = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/servicos")
        if (response.ok) {
          const data = await response.json()
          setServicos(data)
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os serviços",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar serviços:", error)
        toast({
          title: "Erro",
          description: "Erro de conexão ao carregar serviços",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    carregarServicos()
  }, [])

  // Carregar atendentes quando serviço for selecionado
  useEffect(() => {
    if (servicoSelecionado) {
      const carregarAtendentes = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/atendentes?servicoId=${servicoSelecionado.id}`)
          if (response.ok) {
            const data = await response.json()
            setAtendentes(data)
          }
        } catch (error) {
          console.error("Erro ao carregar atendentes:", error)
        } finally {
          setLoading(false)
        }
      }

      carregarAtendentes()
    }
  }, [servicoSelecionado])

  // Carregar horários disponíveis
  useEffect(() => {
    if (servicoSelecionado && atendenteSelecionado && dataSelecionada) {
      const carregarHorarios = async () => {
        try {
          setLoading(true)
          const dataFormatada = format(dataSelecionada, "yyyy-MM-dd")
          const response = await fetch(
            `/api/horarios-disponiveis?servicoId=${servicoSelecionado.id}&atendenteId=${atendenteSelecionado.id}&data=${dataFormatada}`,
          )
          if (response.ok) {
            const data = await response.json()
            setHorariosDisponiveis(data)
          }
        } catch (error) {
          console.error("Erro ao carregar horários:", error)
        } finally {
          setLoading(false)
        }
      }

      carregarHorarios()
    }
  }, [servicoSelecionado, atendenteSelecionado, dataSelecionada])

  const handleServicoSelect = (servico: Servico) => {
    setServicoSelecionado(servico)
    setAtendenteSelecionado(null)
    setDataSelecionada(undefined)
    setHorarioSelecionado("")
    setStep(2)
  }

  const handleAtendenteSelect = (atendente: Atendente) => {
    setAtendenteSelecionado(atendente)
    setDataSelecionada(undefined)
    setHorarioSelecionado("")
    setStep(3)
  }

  const handleDataSelect = (data: Date | undefined) => {
    setDataSelecionada(data)
    setHorarioSelecionado("")
    if (data) {
      setStep(4)
    }
  }

  const handleHorarioSelect = (horario: string) => {
    setHorarioSelecionado(horario)
    setStep(5)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!servicoSelecionado || !atendenteSelecionado || !dataSelecionada || !horarioSelecionado) {
      toast({
        title: "Erro",
        description: "Por favor, complete todas as etapas do agendamento",
        variant: "destructive",
      })
      return
    }

    if (!clienteData.nome || !clienteData.telefone) {
      toast({
        title: "Erro",
        description: "Nome e telefone são obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const dataAgendamento = format(dataSelecionada, "yyyy-MM-dd")

      const response = await fetch("/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          servicoId: servicoSelecionado.id,
          atendenteId: atendenteSelecionado.id,
          dataAgendamento,
          horaInicio: horarioSelecionado,
          clienteData,
        }),
      })

      if (response.ok) {
        const agendamento = await response.json()
        toast({
          title: "Sucesso!",
          description: "Agendamento realizado com sucesso",
        })

        // Reset do formulário
        setStep(1)
        setServicoSelecionado(null)
        setAtendenteSelecionado(null)
        setDataSelecionada(undefined)
        setHorarioSelecionado("")
        setClienteData({
          nome: "",
          telefone: "",
          email: "",
          observacoes: "",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao realizar agendamento",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao agendar:", error)
      toast({
        title: "Erro",
        description: "Erro de conexão ao realizar agendamento",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Salão Exemplo</h1>
          <p className="text-gray-600">Agende seu horário de forma rápida e fácil</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= stepNumber ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-500",
                  )}
                >
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div className={cn("w-8 h-0.5 mx-2", step > stepNumber ? "bg-pink-500" : "bg-gray-200")} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {step === 1 && "Escolha o serviço"}
              {step === 2 && "Escolha o profissional"}
              {step === 3 && "Escolha a data"}
              {step === 4 && "Escolha o horário"}
              {step === 5 && "Seus dados"}
            </p>
          </div>
        </div>

        {/* Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Escolha o Serviço"}
              {step === 2 && "Escolha o Profissional"}
              {step === 3 && "Escolha a Data"}
              {step === 4 && "Escolha o Horário"}
              {step === 5 && "Finalize seu Agendamento"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Selecione o serviço que deseja agendar"}
              {step === 2 && "Escolha o profissional de sua preferência"}
              {step === 3 && "Selecione a data desejada"}
              {step === 4 && "Escolha o melhor horário para você"}
              {step === 5 && "Preencha seus dados para confirmar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Serviços */}
            {step === 1 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando serviços...</p>
                  </div>
                ) : servicos.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-600">Nenhum serviço disponível</p>
                  </div>
                ) : (
                  servicos.map((servico) => (
                    <Card
                      key={servico.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-pink-200"
                      onClick={() => handleServicoSelect(servico)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{servico.nome}</h3>
                        <p className="text-gray-600 text-sm mb-3">{servico.descricao}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-pink-600 font-bold">R$ {servico.preco.toFixed(2)}</span>
                          <span className="text-gray-500 text-sm flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {servico.duracaoMinutos}min
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Step 2: Atendentes */}
            {step === 2 && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando profissionais...</p>
                  </div>
                ) : atendentes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Nenhum profissional disponível para este serviço</p>
                  </div>
                ) : (
                  atendentes.map((atendente) => (
                    <Card
                      key={atendente.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-pink-200"
                      onClick={() => handleAtendenteSelect(atendente)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: atendente.corAgenda }}
                          >
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{atendente.nome}</h3>
                            <p className="text-gray-600 text-sm">
                              Especialidades: {atendente.especialidades.join(", ")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Step 3: Data */}
            {step === 3 && (
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={dataSelecionada}
                  onSelect={handleDataSelect}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </div>
            )}

            {/* Step 4: Horários */}
            {step === 4 && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando horários...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {horariosDisponiveis.map((horario) => (
                      <Button
                        key={horario.time}
                        variant={horario.available ? "outline" : "secondary"}
                        disabled={!horario.available}
                        onClick={() => horario.available && handleHorarioSelect(horario.time)}
                        className={cn(
                          "h-12",
                          horario.available
                            ? "hover:bg-pink-50 hover:border-pink-300"
                            : "opacity-50 cursor-not-allowed",
                        )}
                      >
                        {horario.time}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Dados do Cliente */}
            {step === 5 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resumo do Agendamento */}
                <Card className="bg-pink-50 border-pink-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Resumo do Agendamento</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Serviço:</strong> {servicoSelecionado?.nome}
                      </p>
                      <p>
                        <strong>Profissional:</strong> {atendenteSelecionado?.nome}
                      </p>
                      <p>
                        <strong>Data:</strong>{" "}
                        {dataSelecionada && format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                      <p>
                        <strong>Horário:</strong> {horarioSelecionado}
                      </p>
                      <p>
                        <strong>Valor:</strong> R$ {servicoSelecionado?.preco.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Formulário de Dados */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={clienteData.nome}
                      onChange={(e) => setClienteData({ ...clienteData, nome: e.target.value })}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={clienteData.telefone}
                      onChange={(e) => setClienteData({ ...clienteData, telefone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clienteData.email}
                      onChange={(e) => setClienteData({ ...clienteData, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={clienteData.observacoes}
                      onChange={(e) => setClienteData({ ...clienteData, observacoes: e.target.value })}
                      placeholder="Alguma observação especial?"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(4)} className="flex-1">
                    Voltar
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-pink-500 hover:bg-pink-600">
                    {loading ? "Agendando..." : "Confirmar Agendamento"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
