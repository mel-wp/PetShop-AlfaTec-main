"use client";

import {
  Calendar,
  Package,
  CreditCard,
  BarChart3,
  Smartphone,
  ShieldCheck,
} from "lucide-react"

const services = [
  {
    icon: Calendar,
    title: "Agendamento Online",
    description:
      "Sistema completo de agendamento para banho, tosa, consultas veterinarias e servicos de day care com notificacoes automaticas.",
  },
  {
    icon: Package,
    title: "Controle de Estoque",
    description:
      "Gerencie rações, medicamentos, acessórios e todos os produtos do seu pet shop com alertas de estoque baixo.",
  },
  {
    icon: CreditCard,
    title: "Gestão Financeira",
    description:
      "Controle total do fluxo de caixa, contas a pagar e receber, emissão de notas fiscais e relatórios financeiros.",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Dashboard",
    description:
      "Paineis visuais com indicadores de desempenho, histórico de vendas, clientes mais frequentes e analises de crescimento.",
  },
  {
    icon: Smartphone,
    title: "App para Clientes",
    description:
      "Aplicativo mobile para que os tutores agendem serviços, acompanhem seus pets e recebam promoções exclusivas.",
  },
  {
    icon: ShieldCheck,
    title: "Seguranca e Suporte",
    description:
      "Dados protegidos com criptografia, backups automaticos e suporte tecnico dedicado 24 horas por dia, 7 dias por semana.",
  },
]

export function Services() {
  return (
    <section id="servicos" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Nossos Serviços
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl font-mono">
            Soluções completas para o seu Pet Shop
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Oferecemos um ecossistema de softwares integrados que cobrem todas as necessidades do seu negócio pet.
          </p>
        </div>

        {/* Service cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <a
              key={service.title}
              href="http://192.168.1.23:3001"
              aria-label={`Abrir o sistema AlfaTec e conhecer ${service.title}`}
              className="group block min-h-11 rounded-lg border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground font-mono">
                {service.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
