"use client"

import { useState, useEffect } from "react"
import { Scissors, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Servico {
  id: number
  nome: string
  preco: number
  duracaoMinutos: number
  descricao?: string
}

interface Atendente {
  id: number
  nome: string
  especialidades: string[]
  corAgenda: string
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function AgendarPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Servico | null>(null)
  const [selectedAtendente, setSelectedAtendente] = useState<Atendente | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [clientData, setClientData] = useState({
    nome: "",
    telefone: "",
    email: "",
    observacoes: "",
  })

  const [servicos, setServicos] = useState<Servico[]>([])
  const [atendentes, setAtendentes] = useState<Atendente[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  // Carregar serviços ao montar o componente
  useEffect(() => {
    loadServicos()
  }, [])

  // Carregar atendentes quando serviço for selecionado
  useEffect(() => {
    if (selectedService) {
      loadAtendentes(selectedService.id)
    }
  }, [selectedService])

  // Gerar horários disponíveis quando serviço, atendente e data forem selecionados
  useEffect(() => {
    if (selectedService && selectedAtendente && selectedDate) {
      loadAvailableSlots()
    }
  }, [selectedService, selectedAtendente, selectedDate])

  const loadServicos = async () => {
    try {
      const response = await fetch("/api/servicos")
      if (response.ok) {
        const data = await response.json()
        setServicos(data)
      } else {
        throw new Error("Erro ao carregar serviços")
      }
    } catch (error) {
      console.error("Erro ao carregar serviços:", error)
      setError("Erro ao carregar serviços")
    }
  }

  const loadAtendentes = async (servicoId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/atendentes?servicoId=${servicoId}`)
      if (response.ok) {
        const data = await response.json()
        setAtendentes(data)
      } else {
        throw new Error("Erro ao carregar atendentes")
      }
    } catch (error) {
      console.error("Erro ao carregar atendentes:", error)
      setError("Erro ao carregar profissionais")
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableSlots = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/horarios-disponiveis?atendenteId=${selectedAtendente?.id}&data=${selectedDate}&servicoId=${selectedService?.id}`,
      )
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data)
      } else {
        throw new Error("Erro ao carregar horários")
      }
    } catch (error) {
      console.error("Erro ao carregar horários:", error)
      setError("Erro ao carregar horários disponíveis")
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSelect = (servico: Servico) => {
    setSelectedService(servico)
    setSelectedAtendente(null)
    setSelectedDate("")
    setSelectedTime("")
    setError("")
    setStep(2)
  }

  const handleAtendenteSelect = (atendente: Atendente) => {
    setSelectedAtendente(atendente)
    setSelectedDate("")
    setSelectedTime("")
    setStep(3)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime("")
    setStep(4)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(5)
  }

  const handleSubmit = async () => {
    if (!selectedService || !selectedAtendente || !selectedDate || !selectedTime) {
      setError("Dados incompletos para o agendamento")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          servicoId: selectedService.id,
          atendenteId: selectedAtendente.id,
          dataAgendamento: selectedDate,
          horaInicio: selectedTime,
          clienteData: clientData,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setStep(6)
      } else {
        setError(result.error || "Erro ao criar agendamento")
      }
    } catch (error) {
      console.error("Erro ao agendar:", error)
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split("T")[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold">Salão Exemplo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              {step === 1 && "Escolha o serviço"}
              {step === 2 && "Selecione o profissional"}
              {step === 3 && "Escolha a data"}
              {step === 4 && "Selecione o horário"}
              {step === 5 && "Confirme seus dados"}
              {step === 6 && "Agendamento confirmado!"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 max-w-2xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Escolher Serviço */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Escolha o Serviço</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicos.map((servico) => (
                <Card
                  key={servico.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-pink-200"
                  onClick={() => handleServiceSelect(servico)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Scissors className="w-8 h-8 text-pink-600" />
                      <Badge variant="secondary">{servico.duracaoMinutos} min</Badge>
                    </div>
                    <CardTitle className="text-lg">{servico.nome}</CardTitle>
                    <CardDescription>{servico.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-pink-600">R$ {servico.preco.toFixed(2)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Escolher Atendente */}
        {step === 2 && selectedService && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Escolha o Profissional</h2>
              <p className="text-gray-600">
                Para o serviço: <strong>{selectedService.nome}</strong>
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando profissionais...</p>
              </div>
            ) : atendentes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {atendentes.map((atendente) => (
                  <Card
                    key={atendente.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-pink-200"
                    onClick={() => handleAtendenteSelect(atendente)}
                  >
                    <CardHeader className="text-center">
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: atendente.corAgenda }}
                      >
                        {atendente.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <CardTitle>{atendente.nome}</CardTitle>
                      <CardDescription>
                        <div className="flex flex-wrap gap-1 justify-center mt-2">
                          {atendente.especialidades.map((esp, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {esp}
                            </Badge>
                          ))}
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum profissional disponível</h3>
                  <p className="text-gray-600">
                    Não encontramos profissionais disponíveis para este serviço no momento.
                  </p>
                  <Button onClick={() => setStep(1)} variant="outline" className="mt-4">
                    Escolher outro serviço
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 3: Escolher Data */}
        {step === 3 && selectedService && selectedAtendente && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Escolha a Data</h2>
              <p className="text-gray-600">
                <strong>{selectedService.nome}</strong> com <strong>{selectedAtendente.nome}</strong>
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="date">Selecione a data:</Label>
                <Input
                  id="date"
                  type="date"
                  min={getMinDate()}
                  max={getMaxDate()}
                  value={selectedDate}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Escolher Horário */}
        {step === 4 && selectedDate && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Escolha o Horário</h2>
              <p className="text-gray-600">
                Data: <strong>{new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}</strong>
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando horários...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`${
                          selectedTime === slot.time ? "bg-gradient-to-r from-pink-500 to-purple-600" : ""
                        } ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Dados do Cliente */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Confirme seus Dados</h2>
            </div>

            {/* Resumo do Agendamento */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Serviço:</span>
                    <span className="font-medium">{selectedService?.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profissional:</span>
                    <span className="font-medium">{selectedAtendente?.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data:</span>
                    <span className="font-medium">
                      {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horário:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duração:</span>
                    <span className="font-medium">{selectedService?.duracaoMinutos} minutos</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Valor:</span>
                    <span className="text-pink-600">R$ {selectedService?.preco.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulário de Dados */}
            <Card>
              <CardHeader>
                <CardTitle>Seus Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input
                    id="nome"
                    value={clientData.nome}
                    onChange={(e) => setClientData({ ...clientData, nome: e.target.value })}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                  <Input
                    id="telefone"
                    value={clientData.telefone}
                    onChange={(e) => setClientData({ ...clientData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={clientData.observacoes}
                    onChange={(e) => setClientData({ ...clientData, observacoes: e.target.value })}
                    placeholder="Alguma observação especial?"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!clientData.nome || !clientData.telefone || loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  size="lg"
                >
                  {loading ? "Agendando..." : "Confirmar Agendamento"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 6: Confirmação */}
        {step === 6 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Agendamento Confirmado!</h2>
              <p className="text-gray-600">Seu horário foi reservado com sucesso.</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-left space-y-2">
                    <h3 className="font-semibold text-lg mb-4">Detalhes do seu agendamento:</h3>
                    <div className="flex justify-between">
                      <span>Serviço:</span>
                      <span className="font-medium">{selectedService?.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profissional:</span>
                      <span className="font-medium">{selectedAtendente?.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span className="font-medium">
                        {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horário:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cliente:</span>
                      <span className="font-medium">{clientData.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contato:</span>
                      <span className="font-medium">{clientData.telefone}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Você receberá uma confirmação por WhatsApp e/ou e-mail com os detalhes do agendamento e um link
                      para reagendar ou cancelar, se necessário.
                    </p>
                    <div className="flex gap-4">
                      <Button asChild className="flex-1">
                        <Link href="/">Voltar ao Início</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          setStep(1)
                          setSelectedService(null)
                          setSelectedAtendente(null)
                          setSelectedDate("")
                          setSelectedTime("")
                          setClientData({ nome: "", telefone: "", email: "", observacoes: "" })
                        }}
                      >
                        Agendar Novamente
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
