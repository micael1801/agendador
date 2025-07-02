"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Settings, DollarSign, TrendingUp, CalendarDays, Scissors, Eye } from "lucide-react"
import Link from "next/link"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie seu salão de forma completa</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/agenda">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Agenda
                </Link>
              </Button>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Online
              </Badge>
              <Button variant="outline">Sair</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "agendamentos" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("agendamentos")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendamentos
              </Button>
              <Button
                variant={activeTab === "atendentes" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("atendentes")}
              >
                <Users className="w-4 h-4 mr-2" />
                Atendentes
              </Button>
              <Button
                variant={activeTab === "servicos" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("servicos")}
              >
                <Scissors className="w-4 h-4 mr-2" />
                Serviços
              </Button>
              <Button
                variant={activeTab === "financeiro" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("financeiro")}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Financeiro
              </Button>
              <Button
                variant={activeTab === "configuracoes" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("configuracoes")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+2 desde ontem</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 850</div>
                    <p className="text-xs text-muted-foreground">+15% desde ontem</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">248</div>
                    <p className="text-xs text-muted-foreground">+12 este mês</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">+5% desde a semana passada</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Agendamentos</CardTitle>
                  <CardDescription>Agendamentos para hoje</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        time: "09:00",
                        client: "Maria Silva",
                        service: "Corte + Escova",
                        professional: "Ana Costa",
                        status: "confirmado",
                      },
                      {
                        time: "10:30",
                        client: "João Santos",
                        service: "Corte Masculino",
                        professional: "Maria Silva",
                        status: "confirmado",
                      },
                      {
                        time: "14:00",
                        client: "Carla Oliveira",
                        service: "Coloração",
                        professional: "Ana Costa",
                        status: "pendente",
                      },
                      {
                        time: "15:30",
                        client: "Pedro Lima",
                        service: "Barba",
                        professional: "Maria Silva",
                        status: "confirmado",
                      },
                    ].map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium">{appointment.time}</div>
                          <div>
                            <div className="font-medium">{appointment.client}</div>
                            <div className="text-sm text-gray-500">{appointment.service}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={appointment.status === "confirmado" ? "default" : "secondary"}>
                            {appointment.status}
                          </Badge>
                          <div className="text-sm text-gray-500">{appointment.professional}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "configuracoes" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Configurações da Empresa</h2>

              <Tabs defaultValue="empresa" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="empresa">Empresa</TabsTrigger>
                  <TabsTrigger value="horarios">Horários</TabsTrigger>
                  <TabsTrigger value="tema">Tema</TabsTrigger>
                </TabsList>

                <TabsContent value="empresa" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações da Empresa</CardTitle>
                      <CardDescription>Configure as informações básicas do seu negócio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Nome da Empresa</label>
                          <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded-md"
                            defaultValue="Salão Exemplo"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Slogan</label>
                          <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded-md"
                            defaultValue="Beleza e bem-estar"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Telefone</label>
                          <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded-md"
                            defaultValue="(11) 99999-9999"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">WhatsApp</label>
                          <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded-md"
                            defaultValue="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">E-mail</label>
                        <input
                          type="email"
                          className="w-full mt-1 p-2 border rounded-md"
                          defaultValue="contato@salaoexemplo.com"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Endereço</label>
                        <input
                          type="text"
                          className="w-full mt-1 p-2 border rounded-md"
                          defaultValue="Rua das Flores, 123 - Centro"
                        />
                      </div>

                      <Button>Salvar Alterações</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="horarios" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Horários de Funcionamento</CardTitle>
                      <CardDescription>Configure os horários de atendimento</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          "Segunda-feira",
                          "Terça-feira",
                          "Quarta-feira",
                          "Quinta-feira",
                          "Sexta-feira",
                          "Sábado",
                          "Domingo",
                        ].map((day, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="font-medium">{day}</div>
                            <div className="flex items-center space-x-2">
                              <input type="time" className="p-1 border rounded" defaultValue="08:00" />
                              <span>às</span>
                              <input type="time" className="p-1 border rounded" defaultValue="18:00" />
                              <input type="checkbox" defaultChecked={index < 6} />
                              <span className="text-sm">Aberto</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="mt-4">Salvar Horários</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tema" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personalização do Tema</CardTitle>
                      <CardDescription>Customize as cores do seu site</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium">Cor Principal</label>
                          <div className="flex items-center space-x-2 mt-2">
                            <input type="color" defaultValue="#ec4899" className="w-12 h-12 border rounded" />
                            <input type="text" defaultValue="#ec4899" className="flex-1 p-2 border rounded" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Cor Secundária</label>
                          <div className="flex items-center space-x-2 mt-2">
                            <input type="color" defaultValue="#9333ea" className="w-12 h-12 border rounded" />
                            <input type="text" defaultValue="#9333ea" className="flex-1 p-2 border rounded" />
                          </div>
                        </div>
                      </div>
                      <Button className="mt-4">Aplicar Tema</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "dashboard" && activeTab !== "configuracoes" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-gray-600">Esta seção será implementada em breve.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
