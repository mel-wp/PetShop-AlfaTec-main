"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Package, AlertTriangle, Users, PawPrint, TrendingUp, TrendingDown } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Agendamentos Hoje",
      value: stats.todayAppointments,
      icon: Calendar,
      description: "compromissos para hoje",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Receita Hoje",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(stats.todayRevenue),
      icon: DollarSign,
      description: "faturamento do dia",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Estoque Baixo",
      value: stats.lowStockProducts,
      icon: stats.lowStockProducts > 0 ? AlertTriangle : Package,
      description: "produtos para repor",
      color: stats.lowStockProducts > 0 ? "text-warning" : "text-muted-foreground",
      bgColor: stats.lowStockProducts > 0 ? "bg-warning/10" : "bg-muted",
    },
    {
      title: "Contas a Pagar",
      value: stats.pendingPayables,
      icon: AlertTriangle,
      description: "contas pendentes",
      color: stats.pendingPayables > 0 ? "text-destructive" : "text-muted-foreground",
      bgColor: stats.pendingPayables > 0 ? "bg-destructive/10" : "bg-muted",
    },
  ]

  const summaryCards = [
    {
      title: "Receita Mensal",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(stats.monthlyRevenue),
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Despesas Mensais",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(stats.monthlyExpenses),
      icon: TrendingDown,
      color: "text-destructive",
    },
    {
      title: "Total de Clientes",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Total de Pets",
      value: stats.totalPets,
      icon: PawPrint,
      color: "text-accent",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="bg-card/50">
            <CardContent className="flex items-center gap-4 p-4">
              <card.icon className={`h-8 w-8 ${card.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{card.title}</p>
                <p className="text-lg font-semibold">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
