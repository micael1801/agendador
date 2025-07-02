import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star, MapPin, Phone, Scissors, Sparkles, Heart, Settings } from "lucide-react"

export default function HomePage() {
  const servicos = [
    {
      nome: "Corte de Cabelo",
      preco: "R$ 50,00",
      duracao: "60 min",
      descricao: "Corte personalizado com as últimas tendências",
      icon: Scissors,
    },
    {
      nome: "Escova",
      preco: "R$ 35,00",
      duracao: "45 min",
      descricao: "Escova modeladora para todos os tipos de cabelo",
      icon: Sparkles,
    },
    {
      nome: "Manicure",
      preco: "R$ 25,00",
      duracao: "60 min",
      descricao: "Cuidado completo para suas unhas",
      icon: Heart,
    },
    {
      nome: "Pedicure",
      preco: "R$ 30,00",
      duracao: "60 min",
      descricao: "Relaxamento e cuidado para seus pés",
      icon: Heart,
    },
    {
      nome: "Coloração",
      preco: "R$ 80,00",
      duracao: "120 min",
      descricao: "Coloração profissional com produtos de qualidade",
      icon: Sparkles,
    },
  ]

  const avaliacoes = [
    {
      nome: "Maria Silva",
      avaliacao: 5,
      comentario: "Excelente atendimento! Adorei o resultado do meu cabelo.",
      servico: "Corte + Escova",
    },
    {
      nome: "Ana Costa",
      avaliacao: 5,
      comentario: "Profissionais muito competentes. Super recomendo!",
      servico: "Manicure",
    },
    {
      nome: "Julia Santos",
      avaliacao: 5,
      comentario: "Ambiente acolhedor e serviço de primeira qualidade.",
      servico: "Coloração",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Salão de Beleza
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/agendar">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sua beleza é nossa
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> paixão</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transforme seu visual com nossos profissionais especializados. Agende seu horário e descubra o melhor de
            você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/agendar">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Agora
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              <Phone className="h-5 w-5 mr-2" />
              (11) 99999-9999
            </Button>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nossos Serviços</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma ampla gama de serviços para realçar sua beleza natural
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.map((servico, index) => {
              const IconComponent = servico.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-3 rounded-full">
                        <IconComponent className="h-6 w-6 text-pink-600" />
                      </div>
                      <Badge variant="secondary" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                        {servico.duracao}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{servico.nome}</CardTitle>
                    <CardDescription>{servico.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-pink-600">{servico.preco}</span>
                      <Link href="/agendar">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          Agendar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Avaliações */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">O que nossos clientes dizem</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A satisfação dos nossos clientes é nossa maior recompensa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {avaliacoes.map((avaliacao, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(avaliacao.avaliacao)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{avaliacao.nome}</CardTitle>
                  <Badge variant="outline">{avaliacao.servico}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{avaliacao.comentario}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visite nosso salão</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Estamos localizados no coração da cidade, prontos para recebê-la
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Endereço</h3>
              <p className="opacity-90">
                Rua das Flores, 123
                <br />
                Centro - São Paulo/SP
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Telefone</h3>
              <p className="opacity-90">
                (11) 99999-9999
                <br />
                WhatsApp disponível
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Horário</h3>
              <p className="opacity-90">
                Seg - Sex: 9h às 18h
                <br />
                Sáb: 9h às 16h
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h3 className="ml-3 text-2xl font-bold">Salão de Beleza</h3>
          </div>
          <p className="text-gray-400 mb-6">Transformando vidas através da beleza desde 2020</p>
          <div className="flex justify-center space-x-6">
            <Link href="/agendar">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                Agendar Serviço
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Área Administrativa
              </Button>
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400">
            <p>&copy; 2024 Salão de Beleza. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
