"use client"

import Image from "next/image"
import { useState } from "react"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    title: "PetManager Pro",
    category: "Sistema de Gestão",
    description:
      "Plataforma completa de gestão para pet shops com agendamento, controle de estoque e financeiro. Utilizada por mais de 30 estabelecimentos.",
    image: "/images/portfolio-1.jpg",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    title: "PetStock Mobile",
    category: "Aplicativo Mobile",
    description:
      "App mobile para controle de inventario em tempo real, com leitura de código de barras e alertas inteligentes de reposição.",
    image: "/images/portfolio-2.jpg",
    tags: ["React Native", "Firebase", "TypeScript"],
  },
  {
    title: "PetPDV",
    category: "Ponto de Venda",
    description:
      "Sistema PDV moderno e intuitivo com integração de pagamentos, impressão de cupons e gestão de caixa simplificada.",
    image: "/images/portfolio-3.jpg",
    tags: ["Next.js", "Stripe", "Tailwind CSS"],
  },
]

const categories = ["Todos", "Sistema de Gestao", "Aplicativo Mobile", "Ponto de Venda"]

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filtered =
    activeCategory === "Todos"
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <section id="portfolio" className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Portifólio
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl font-mono">
            Projetos que fazem a diferença
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Conheça alguns dos softwares que desenvolvemos para transformar a
            rotina de pet shops em todo o Brasil.
          </p>
        </div>

        {/* Filter */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <div
              key={project.title}
              className="group overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-2 rounded-md bg-background px-4 py-2 text-sm font-semibold text-primary">
                    Ver Detalhes <ExternalLink className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {project.category}
                </span>
                <h3 className="mt-2 text-lg font-bold text-foreground font-mono">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
