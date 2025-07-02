"use client"

import { useState, useEffect } from "react"
import { Scissors, Clock, MapPin, Phone, Mail, Star, ArrowRight, Calendar, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Servico {
  id: number
  nome: string
  preco: number
  duracaoMinutos: number
  descricao?: string
}

export default function HomePage() {
  const [servicos, setServicos] = useState<Servico[]>([])

  useEffect(() => {
    loadServicos()
  }, [])

  const loadServicos = async () => {
    try {
      const response = await fetch("/api/servicos")
      if (response.ok) {
        const data = await response.json()
        setServicos(data.slice(0, 6)) // Mostrar apenas os primeiros 6
      }
    } catch (error) {
      console.error("Erro ao carregar serviços:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Salão Exemplo</h1>
                <p className="text-sm text-gray-600">Beleza e bem-estar</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Link href="/agendar">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transforme seu visual com
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"> estilo</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experimente nossos serviços de beleza com profissionais qualificados em um ambiente acolhedor e moderno.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Link href="/agendar">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Agora
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#servicos">
                Ver Serviços
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Clientes Satisfeitos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">5+</h3>
              <p className="text-gray-600">Anos de Experiência</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.9</h3>
              <p className="text-gray-600">Avaliação Média</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Serviços</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma ampla gama de serviços de beleza para realçar sua beleza natural
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.map((servico) => (
              <Card key={servico.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Scissors className="w-8 h-8 text-pink-600" />
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {servico.duracaoMinutos} min
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{servico.nome}</CardTitle>
                  <CardDescription>{servico.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-pink-600">R$ {servico.preco.toFixed(2)}</div>
                    <Button asChild size="sm">
                      <Link href="/agendar">Agendar</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Link href="/agendar">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Serviço
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
            <p className="text-xl text-gray-600">Estamos aqui para cuidar da sua beleza</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <MapPin className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Rua das Flores, 123
                  <br />
                  Centro - São Paulo, SP
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Phone className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <CardTitle>Telefone</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  (11) 99999-9999
                  <br />
                  WhatsApp disponível
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Mail className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <CardTitle>E-mail</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  contato@salaoexemplo.com
                  <br />
                  Respondemos em até 24h
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Salão Exemplo</span>
              </div>
              <p className="text-gray-400">
                Transformando sua beleza com carinho e profissionalismo há mais de 5 anos.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Cortes Femininos</li>
                <li>Cortes Masculinos</li>
                <li>Coloração</li>
                <li>Escova</li>
                <li>Manicure</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horários</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Segunda a Sexta: 8h às 18h</li>
                <li>Sábado: 8h às 16h</li>
                <li>Domingo: Fechado</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li>(11) 99999-9999</li>
                <li>contato@salaoexemplo.com</li>
                <li>Rua das Flores, 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Salão Exemplo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
