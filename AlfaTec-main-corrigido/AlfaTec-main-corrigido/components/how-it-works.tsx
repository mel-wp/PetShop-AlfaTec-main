"use client";

import { Store, CalendarDays, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Store,
    title: "Cadastre seu pet shop",
    description:
      "Cadastre clientes, pets e configure seu estabelecimento em poucos minutos.",
  },
  {
    icon: CalendarDays,
    title: "Organize agendamentos e estoque",
    description:
      "Controle serviços, estoque e agenda em um único lugar.",
  },
  {
    icon: BarChart3,
    title: "Acompanhe os resultados",
    description:
      "Visualize relatórios e acompanhe o crescimento do seu negócio.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            Como funciona
          </h2>

          <p className="mt-4 text-muted-foreground">
            Em apenas três passos você já começa a organizar seu pet shop.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border bg-background p-8 text-center shadow-sm"
            >
              <step.icon className="mx-auto h-12 w-12 text-primary mb-5" />

              <h3 className="text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}