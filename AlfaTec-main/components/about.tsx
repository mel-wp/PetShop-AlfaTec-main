import { Target, Eye, Heart } from "lucide-react"

const items = [
  {
    icon: Target,
    title: "Missão",
    description:
      "Desenvolver soluções tecnológicas inovadoras e acessiveis que otimizem a gestão de pet shops, promovendo eficiencia operacional e satisfação dos nossos clientes e seus tutores.",
  },
  {
    icon: Eye,
    title: "Visão",
    description:
      "Ser a principal referência em softwares para o mercado pet no Brasil, reconhecida pela excelência, inovação e compromisso com o bem-estar animal atraves da tecnologia.",
  },
  {
    icon: Heart,
    title: "Valores",
    description:
      "Inovação constante, compromisso com a qualidade, transparência, respeito ao cliente e paixão pelo universo pet. Acreditamos que tecnologia e cuidado animal caminham juntos.",
  },
]

export function About() {
  return (
    <section id="sobre" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Quem Somos
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl font-mono">
            Tecnologia pensada para o mercado pet
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            A AlfaTech nasceu da paixão por tecnologia e pelo amor aos animais.
            Somos especializados em criar softwares que simplificam o dia a dia
            de pet shops, clinicas veterinárias e petshops online.
          </p>
        </div>

        {/* Objective */}
        <div className="mt-16 rounded-lg border border-border bg-secondary p-8 text-center md:p-12">
          <h3 className="text-xl font-bold text-primary md:text-2xl font-mono">
            Nosso Objetivo
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Empoderar pet shops de todos os tamanhos com ferramentas digitais que
            automatizam processos, aumentam a produtividade e melhoram a
            experiencia do cliente final. Queremos que cada pet shop possa focar
            no que realmente importa: o cuidado com os animais.
          </p>
        </div>

        {/* Mission / Vision / Values */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-lg border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <item.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground font-mono">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
