import Image from "next/image"

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner-hero.jpg"
          alt="AlfaTec - Alfa em tecnologia"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-32 text-center">
        <span className="inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary-foreground">
          Software para Pet Shops
        </span>

        <h1 className="max-w-4xl text-balance text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl font-mono">
          Tecnologia que transforma a gestão da sua empresa
        </h1>

        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
          Desenvolvemos softwares completos e personalizados para o mercado pet.
          Agendamento, estoque, financeiro e muito mais em um só lugar.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#demonstracao"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-background px-8 py-3 text-base font-semibold text-primary transition-colors hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
          >
            Agendar demonstração grátis
          </a>
          <a
            href="#contato"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-primary-foreground/30 px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
          >
            Ver demonstração
          </a>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { number: "50+", label: "Pet Shops Atendidos" },
            { number: "3", label: "Anos de Experiência" },
            { number: "98%", label: "Satisfação dos Clientes" },
            { number: "24/7", label: "Suporte Técnico" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary-foreground md:text-4xl font-mono">
                {stat.number}
              </p>
              <p className="mt-1 text-sm text-primary-foreground/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
