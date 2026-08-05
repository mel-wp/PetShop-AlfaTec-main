"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Equipe", href: "#equipe" },
  { label: "Serviços", href: "#servicos" },
  { label: "Portifólio", href: "#portfolio" },
  { label: "Marca", href: "#marca" },
  { label: "Contato", href: "#contato" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="#inicio" className="flex min-h-11 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground">
          <Image
            src="/images/logo.jpeg"
            alt="AlfaTech Logo"
            width={50}
            height={50}
            className="rounded-md"
          />
          <span className="text-xl font-bold tracking-tight text-primary-foreground font-mono">
            AlfaTec
          </span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Navegação principal" className="hidden items-center gap-3 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#contato"
          className="hidden min-h-11 items-center rounded-md bg-background px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground lg:inline-flex"
        >
          Agendar demonstração grátis
        </a>

        {/* Mobile toggle */}
        <button
          className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav id="menu-mobile" aria-label="Navegação móvel" className="border-t border-primary-foreground/10 bg-primary px-6 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md px-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-11 items-center justify-center rounded-md bg-background px-5 py-2 text-center text-sm font-semibold text-primary transition-colors hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
            >
              Agendar demonstração grátis
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
