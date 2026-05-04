import Image from "next/image"

export function Brand() {
  return (
    <section id="marca" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Nossa Marca
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl font-mono">
            Logotipo e Logomarca
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Nossa identidade visual reflete inovação, confiança e a conexão
            entre tecnologia e o universo pet.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {/* Logotipo */}
          <div className="flex flex-col items-center rounded-lg border border-border bg-card p-8 md:p-12">
            <span className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">
              Logotipo
            </span>
            <div className="relative flex h-32 w-full items-center justify-center md:h-40">
              <Image
                src="/images/logotipo.jpeg"
                alt="AlfaTech Logotipo - Versao completa com texto"
                width={210}
                height={95}
                className="object-contain"
              />
            </div>
            <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
              O logotipo completo da AlfaTec combina o simbolo com a tipografia
              da marca. Utilizado em materiais institucionais, apresentações e
              como identificação principal da empresa.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">#0c3470</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full border border-border bg-background" />
                <span className="text-xs text-muted-foreground">#FFFFFF</span>
              </div>
            </div>
          </div>

          {/* Logomarca */}
          <div className="flex flex-col items-center rounded-lg border border-border bg-card p-8 md:p-12">
            <span className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">
              Logomarca (Simbolo)
            </span>
            <div className="relative flex h-32 w-full items-center justify-center md:h-40">
              <Image
                src="/images/logo.jpeg"
                alt="AlfaTech Logomarca - Simbolo da marca"
                width={160}
                height={160}
                className="object-contain"
              />
            </div>
            <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
              A logomarca (simbolo) da AlfaTec pode ser usada de forma
              independente como icone de aplicativos, favicon, avatar em redes
              sociais e em espaços reduzidos onde o logotipo completo nao se
              aplica.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Primaria</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full border border-border bg-background" />
                <span className="text-xs text-muted-foreground">Branca</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand usage guidelines */}
        <div className="mt-16 rounded-lg bg-primary p-8 md:p-12">
          <h3 className="text-center text-xl font-bold text-primary-foreground md:text-2xl font-mono">
            Diretrizes de Uso da Marca
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Cores",
                text: "Sempre utilize as cores oficiais: azul marinho (#0c3470), preto e branco.",
              },
              {
                title: "Espaçamento",
                text: "Mantenha uma area de protecao ao redor do logotipo equivalente a altura do simbolo.",
              },
              {
                title: "Proporção",
                text: "Nunca distorca ou altere as proporcoes do logotipo e da logomarca.",
              },
              {
                title: "Fundo",
                text: "Utilize a versao clara sobre fundos escuros e a versao escura sobre fundos claros.",
              },
            ].map((guideline) => (
              <div key={guideline.title} className="text-center">
                <h4 className="text-base font-semibold text-primary-foreground font-mono">
                  {guideline.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">
                  {guideline.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
