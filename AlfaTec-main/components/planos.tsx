"use client";

import { Check } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "R$ 49/mês",
    description: "Ideal para pequenos pet shops iniciando a digitalização.",
    features: [
      "Agendamento online",
      "Cadastro de clientes",
      "Suporte básico",
    ],
    highlight: false,
  },
  {
    name: "Profissional",
    price: "R$ 99/mês",
    description: "Para negócios em crescimento que precisam de mais controle.",
    features: [
      "Tudo do plano Básico",
      "Controle de estoque",
      "Relatórios financeiros",
      "App para clientes",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "R$ 149/mês",
    description: "Solução completa para grandes pet shops e franquias.",
    features: [
      "Tudo do plano Profissional",
      "Dashboard avançado",
      "Suporte 24/7",
      "Automação completa",
    ],
    highlight: false,
  },
];

export function Plans() {

  const scrollToCadastro = (planName: string) => {
    window.dispatchEvent(new CustomEvent("select-plan", { detail: planName }));
    document.getElementById("contato")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section id="planos" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Planos
          </span>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl font-mono">
            Escolha o plano ideal para o seu negócio
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Planos flexíveis que acompanham o crescimento do seu pet shop.
          </p>
        </div>
        <div className="mb-14 text-center">

          <h2 className="text-4xl font-bold">
            Escolha o plano ideal
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Mais organização para você, mais cuidado para os pets.
          </p>

        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border bg-card p-8 transition-all hover:shadow-lg ${plan.highlight
                  ? "border-primary shadow-md scale-[1.02]"
                  : "border-border hover:border-primary/30"
                }`}
            >
              {/* Badge destaque */}
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  Mais escolhido
                </span>
              )}

              <h3 className="text-lg font-bold text-foreground font-mono">
                {plan.name}
              </h3>

              <p className="mt-2 text-2xl font-bold text-primary">
                {plan.price}
              </p>

              <p className="mt-3 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* BOTÃO FUNCIONANDO */}
              <button
                onClick={() => scrollToCadastro(plan.name)}
                className="mt-8 w-full rounded-md bg-primary py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Escolher plano
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
