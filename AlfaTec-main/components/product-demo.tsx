"use client"

import { CalendarDays, Dog, Package, TrendingUp, Users } from "lucide-react"
import { useState } from "react"

const screens = ["Dashboard", "Agenda", "Estoque"] as const
type Screen = (typeof screens)[number]

export function ProductDemo() {
  const [screen, setScreen] = useState<Screen>("Dashboard")
  return (
    <section id="demonstracao" className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Veja o produto</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl font-mono">O pet shop sob controle, em uma única tela</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Uma prévia do painel AlfaTec, com os recursos usados no dia a dia da operação.</p>
        </div>
        <div className="mt-10 flex justify-center gap-2" role="tablist" aria-label="Telas do sistema">
          {screens.map((item) => <button key={item} type="button" role="tab" aria-selected={screen === item} onClick={() => setScreen(item)} className={`min-h-11 rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${screen === item ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-primary"}`}>{item}</button>)}
        </div>
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
          <div className="flex items-center gap-2 border-b border-border bg-slate-50 px-4 py-3"><i className="h-2.5 w-2.5 rounded-full bg-red-400" /><i className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><i className="h-2.5 w-2.5 rounded-full bg-green-400" /><span className="ml-3 text-xs font-medium text-muted-foreground">app.alfatec.com.br/dashboard</span></div>
          <div className="grid min-h-[420px] md:grid-cols-[190px_1fr]">
            <aside className="hidden bg-primary p-5 text-primary-foreground md:block"><div className="flex items-center gap-2 font-bold"><Dog className="h-5 w-5" /> AlfaTec</div><div className="mt-9 space-y-2 text-sm text-primary-foreground/75">{["Dashboard", "Agendamentos", "Clientes", "Pets", "Estoque", "Financeiro"].map((item) => <div key={item} className={`rounded-md px-3 py-2 ${item === screen || (screen === "Agenda" && item === "Agendamentos") ? "bg-white/15 text-white" : ""}`}>{item}</div>)}</div></aside>
            <div className="p-5 sm:p-8">{screen === "Dashboard" ? <Dashboard /> : screen === "Agenda" ? <Agenda /> : <Stock />}</div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-primary/15 bg-primary/5 p-5 sm:flex-row"><p className="text-center text-sm font-medium text-foreground sm:text-left">Quer ver esses recursos aplicados à rotina do seu negócio?</p><a href="#contato" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Agendar demonstração grátis</a></div>
      </div>
    </section>
  )
}

function Dashboard() {
  const cards = [[CalendarDays, "Agendamentos hoje", "12"], [TrendingUp, "Receita hoje", "R$ 1.280"], [Package, "Estoque baixo", "4"], [Users, "Clientes ativos", "248"]] as const
  return <><h3 className="text-2xl font-bold">Bom dia, Pet Feliz!</h3><p className="mt-1 text-sm text-muted-foreground">Aqui está o resumo da sua operação hoje.</p><div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([Icon, label, value]) => <div key={label} className="rounded-lg border border-border p-4"><Icon className="h-5 w-5 text-primary" /><p className="mt-4 text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>)}</div><div className="mt-6 rounded-lg border border-border p-5"><h4 className="font-semibold">Agendamentos de hoje</h4><p className="text-sm text-muted-foreground">12 serviços confirmados</p><div className="mt-5 space-y-3">{["09:00  •  Banho e tosa — Thor", "10:30  •  Consulta — Mel", "14:00  •  Banho — Luna"].map((item) => <div key={item} className="rounded-md bg-secondary px-3 py-2 text-sm">{item}</div>)}</div></div></>
}

function Agenda() { return <><h3 className="text-2xl font-bold">Agendamentos</h3><p className="mt-1 text-sm text-muted-foreground">Quarta-feira, 29 de julho</p><div className="mt-6 space-y-3">{[["09:00", "Thor", "Banho e tosa", "Confirmado"], ["10:30", "Mel", "Consulta veterinária", "Confirmado"], ["14:00", "Luna", "Banho", "Aguardando"]].map(([time, pet, service, status]) => <div key={pet} className="flex items-center gap-4 rounded-lg border border-border p-4"><span className="font-bold text-primary">{time}</span><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10"><Dog className="h-4 w-4 text-primary" /></div><div className="flex-1"><p className="font-semibold">{pet}</p><p className="text-sm text-muted-foreground">{service}</p></div><span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">{status}</span></div>)}</div></> }

function Stock() { return <><h3 className="text-2xl font-bold">Controle de estoque</h3><p className="mt-1 text-sm text-muted-foreground">Acompanhe produtos e reposições sem planilhas.</p><div className="mt-6 overflow-hidden rounded-lg border border-border"><div className="grid grid-cols-[1fr_90px_100px] bg-secondary px-4 py-3 text-xs font-semibold text-muted-foreground"><span>Produto</span><span>Estoque</span><span>Status</span></div>{[["Ração Premium 15kg", "18 un.", "Em dia"], ["Shampoo neutro", "4 un.", "Repor"], ["Antipulgas", "7 un.", "Repor"]].map(([product, quantity, status]) => <div key={product} className="grid grid-cols-[1fr_90px_100px] border-t border-border px-4 py-4 text-sm"><span className="font-medium">{product}</span><span>{quantity}</span><span className={status === "Repor" ? "font-semibold text-amber-600" : "text-green-700"}>{status}</span></div>)}</div></> }
