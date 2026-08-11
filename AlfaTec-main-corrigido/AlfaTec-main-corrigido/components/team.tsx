import Image from "next/image"
import { Linkedin, Github, Mail } from "lucide-react"

const team = [
{
    name: "Melina Wilpert Pires",
    role: "CEO & Dev",
    image: "/images/melina.jpeg",
    bio: "Apaixonado por tecnologia e pelo mundo animal, Melina lidera a AlfaTec com visão estratégica e paixão pelo que faz.",
  },
  {
    name: "Sophia Mileski",
    role: "Designer",
    image: "/images/sophia.jpeg",
    bio: "Responsável por criar interfaces intuitivas e bonitas que encantam os usuarios dos nossos softwares.",
  },
  {
    name: "Karine Johann",
    role: "Dev",
    image: "/images/karine.jpeg",
    bio: "Com mais de 10 anos de experiencia, Karine garante que nossas soluções sejam robustas, seguras e escalaveis.",
  },
  {
    name: "Clara Paludo",
    role: "Marketing",
    image: "/images/clara.jpeg",
    bio: "Clara conecta as necessidades dos clientes com as entregas da equipe, garantindo resultados excepcionais.",
  },
  {
    name: "João Antônio Panho",
    role: "Dev",
    image: "/images/joao.jpeg",
    bio: "Especialista em APIs e banco de dados, João constroi a base solida que sustenta todos os nossos sistemas.",
  },
]

export function Team() {
  return (
    <section id="equipe" className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Nossa Equipe
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl font-mono">
            Profissionais dedicados ao seu sucesso
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Conheça o time por tras das soluções que transformam pet shops em todo
            o Brasil.
          </p>
        </div>

        {/* Team grid */}
        <div className="mt-16 grid justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="group overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground font-mono">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`GitHub de ${member.name}`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`Email de ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
