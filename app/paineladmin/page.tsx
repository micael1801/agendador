"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Settings, DollarSign, TrendingUp, CalendarDays, Scissors, Eye, LogOut } from "lucide-react"
import Link from "next/link"

export default function AdminPanel() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setLoading(false)
    }
  }

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
              <Button variant="outline" onClick={handleLogout} disabled={loading}>
                <LogOut className="w-4 h-4 mr-2" />
                {loading ? "Saindo..." : "Sair"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/agenda")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span>Agenda</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Visualizar e gerenciar agendamentos por atendente</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Atendentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Gerenciar profissionais e especialidades</p>
              <Badge variant="secondary" className="mt-2">
                Em breve
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-green-600" />
                <span>Serviços</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Configurar serviços, preços e durações</p>
              <Badge variant="secondary" className="mt-2">
                Em breve
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <span>Financeiro</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Relatórios e controle financeiro</p>
              <Badge variant="secondary" className="mt-2">
                Em breve
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <span>Configurações</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Configurações gerais do sistema</p>
              <Badge variant="secondary" className="mt-2">
                Em breve
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <Card className="mt-8">
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
    </div>
  )
}
