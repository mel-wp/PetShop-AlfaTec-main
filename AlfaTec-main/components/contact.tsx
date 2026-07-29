"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"

export function Contact() {
  const [selectedPlan, setSelectedPlan] = useState("")
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const selectPlan = (event: Event) => {
      setSelectedPlan((event as CustomEvent<string>).detail)
      setSent(false)
    }
    window.addEventListener("select-plan", selectPlan)
    return () => window.removeEventListener("select-plan", selectPlan)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section id="contato" className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left column - Info */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Contato
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl font-mono">
              Vamos crescer juntos?
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Entre em contato e agende uma consulta gratuita. Estamos prontos
              para entender as necessidades do seu pet shop e apresentar a
              solução ideal.
            </p>

            <div className="mt-10 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Mail className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p className="mt-1 text-muted-foreground">
                    alfatec@email.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Phone className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Telefone</h4>
                  <p className="mt-1 text-muted-foreground">
                    (49) 99876-5432
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Endereço</h4>
                  <p className="mt-1 text-muted-foreground">
                    Concórdia, SC - Brasil
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div className="rounded-lg border border-border bg-card p-8">
            <h3 className="text-xl font-bold text-foreground font-mono">
              Agende sua demonstração grátis
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">Preencha os dados e nossa equipe entrará em contato.</p>
            <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="plan" className="mb-1.5 block text-sm font-medium text-foreground">Plano de interesse</label>
                <select id="plan" value={selectedPlan} onChange={(event) => setSelectedPlan(event.target.value)} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
                  <option value="">Quero conhecer as opções</option>
                  <option value="Básico">Básico</option>
                  <option value="Profissional">Profissional</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Telefone
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Mensagem
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Conte-nos sobre o seu pet shop..."
                  className="w-full resize-none rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Agendar demonstração grátis
              </button>
              {sent && <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">Recebemos seu pedido! Em breve entraremos em contato para agendar sua demonstração.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
