"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserPlus, X } from "lucide-react"

const especialidadesDisponiveis = [
  "Corte Feminino",
  "Corte Masculino",
  "Coloração",
  "Escova",
  "Hidratação",
  "Manicure",
  "Pedicure",
  "Penteados",
  "Tratamentos",
]

const coresDisponiveis = [
  { nome: "Rosa", valor: "#ec4899" },
  { nome: "Roxo", valor: "#8b5cf6" },
  { nome: "Azul", valor: "#3b82f6" },
  { nome: "Verde", valor: "#10b981" },
  { nome: "Laranja", valor: "#f59e0b" },
  { nome: "Vermelho", valor: "#ef4444" },
  { nome: "Indigo", valor: "#6366f1" },
  { nome: "Teal", valor: "#14b8a6" },
]

export default function CadastroPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [especialidades, setEspecialidades] = useState<string[]>([])
  const [corAgenda, setCorAgenda] = useState("#3b82f6")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const adicionarEspecialidade = (especialidade: string) => {
    if (!especialidades.includes(especialidade)) {
      setEspecialidades([...especialidades, especialidade])
    }
  }

  const removerEspecialidade = (especialidade: string) => {
    setEspecialidades(especialidades.filter((e) => e !== especialidade))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          especialidades,
          corAgenda,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Cadastro realizado com sucesso! Redirecionando...")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(data.error || "Erro ao fazer cadastro")
      }
    } catch (error) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Cadastro de Atendente</CardTitle>
          <CardDescription className="text-center">Crie sua conta para começar a usar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {especialidadesDisponiveis.map((esp) => (
                  <Button
                    key={esp}
                    type="button"
                    variant={especialidades.includes(esp) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      especialidades.includes(esp) ? removerEspecialidade(esp) : adicionarEspecialidade(esp)
                    }
                    disabled={loading}
                  >
                    {esp}
                  </Button>
                ))}
              </div>
              {especialidades.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {especialidades.map((esp) => (
                    <Badge key={esp} variant="secondary" className="text-xs">
                      {esp}
                      <button
                        type="button"
                        onClick={() => removerEspecialidade(esp)}
                        className="ml-1 hover:text-red-500"
                        disabled={loading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cor da Agenda</Label>
              <div className="flex flex-wrap gap-2">
                {coresDisponiveis.map((cor) => (
                  <button
                    key={cor.valor}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      corAgenda === cor.valor ? "border-gray-800" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: cor.valor }}
                    onClick={() => setCorAgenda(cor.valor)}
                    disabled={loading}
                    title={cor.nome}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-pink-600 hover:text-pink-500 font-medium">
                Faça login aqui
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
