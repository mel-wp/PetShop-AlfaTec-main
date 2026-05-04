import Image from "next/image"
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react"

const footerLinks = {
  Empresa: [
    { label: "Sobre", href: "#sobre" },
    { label: "Equipe", href: "#equipe" },
    { label: "Portifólio", href: "#portfolio" },
    { label: "Marca", href: "#marca" },
  ],
  Servicos: [
    { label: "Agendamento Online", href: "#servicos" },
    { label: "Controle de Estoque", href: "#servicos" },
    { label: "Gestao Financeira", href: "#servicos" },
    { label: "App para Clientes", href: "#servicos" },
  ],
  Suporte: [
    { label: "Central de Ajuda", href: "#contato" },
    { label: "Documentacao", href: "#" },
    { label: "Status do Sistema", href: "#" },
    { label: "Fale Conosco", href: "#contato" },
  ],
}

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-primary">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#inicio" className="flex items-center gap-4">
              <Image
                src="/images/logo.jpeg"
                alt="AlfaTec Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="text-lg font-bold text-primary-foreground font-mono">
                AlfaTec
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              Desenvolvemos softwares inovadores para pet shops. Tecnologia,
              paixão e cuidado animal em cada detalhe.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground">
                {title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-sm text-primary-foreground/50">
            {'2026 AlfaTec. Todos os direitos reservados.'}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-primary-foreground/50 transition-colors hover:text-primary-foreground"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="text-sm text-primary-foreground/50 transition-colors hover:text-primary-foreground"
            >
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
