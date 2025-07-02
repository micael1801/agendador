"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col p-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Agendamento</h1>
          <p className="text-xl text-gray-600">Gerencie seus agendamentos de forma simples e eficiente</p>
        </div>
        <div className="space-x-2">
          <Button onClick={() => router.push("/login")} variant="outline">
            Entrar
          </Button>
          <Button onClick={() => router.push("/cadastro")}>Cadastrar</Button>
        </div>
      </div>

      {/* rest of code here */}
    </main>
  )
}
