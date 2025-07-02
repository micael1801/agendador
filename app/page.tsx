import { Calendar, Clock, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Salão Exemplo</h1>
                <p className="text-sm text-gray-600">Beleza e bem-estar</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Seg-Sáb: 8h-18h</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Agende seu horário
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              de forma simples
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Escolha o serviço, profissional e horário que melhor se adequa à sua agenda. Receba confirmação por email e
            WhatsApp.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Agora
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Nossos Serviços</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Corte Feminino", price: "R$ 45", duration: "45 min", popular: true },
              { name: "Corte Masculino", price: "R$ 25", duration: "30 min", popular: false },
              { name: "Coloração", price: "R$ 120", duration: "2h", popular: false },
              { name: "Escova", price: "R$ 35", duration: "40 min", popular: true },
              { name: "Hidratação", price: "R$ 60", duration: "1h", popular: false },
              { name: "Manicure", price: "R$ 20", duration: "30 min", popular: true },
            ].map((service, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                {service.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600">
                    Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">{service.price}</span>
                    <span className="text-gray-500">{service.duration}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-transparent" variant="outline">
                    Agendar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Nossa Equipe</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Maria Silva", specialty: "Colorista e Cabeleireira", experience: "8 anos" },
              { name: "Ana Costa", specialty: "Cortes e Penteados", experience: "5 anos" },
              { name: "Julia Santos", specialty: "Manicure e Pedicure", experience: "3 anos" },
            ].map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{member.experience} de experiência</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Entre em Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-pink-600" />
                  <span>Rua das Flores, 123 - Centro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-pink-600" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-pink-600" />
                  <span>contato@salaoexemplo.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-pink-600" />
                  <span>Segunda a Sábado: 8h às 18h</span>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <Button size="icon" variant="outline">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Facebook className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h4 className="text-xl font-bold mb-4">Horários de Funcionamento</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Segunda-feira</span>
                  <span>8h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Terça-feira</span>
                  <span>8h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Quarta-feira</span>
                  <span>8h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Quinta-feira</span>
                  <span>8h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sexta-feira</span>
                  <span>8h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span>8h - 18h</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Domingo</span>
                  <span>Fechado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Salão Exemplo. Todos os direitos reservados.</p>
          <div className="mt-4">
            <Link href="/paineladmin" className="text-gray-400 hover:text-white text-sm">
              Acesso Administrativo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
