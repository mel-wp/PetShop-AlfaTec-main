import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Team } from "@/components/team"
import { Services } from "@/components/services"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Plans } from "@/components/planos"
import { HowItWorks } from "@/components/how-it-works";
import { ProductDemo } from "@/components/product-demo"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Home() {
  return (
    <>
      <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-3 focus:font-semibold focus:text-primary focus:shadow-lg">
        Pular para o conteúdo principal
      </a>
      <Navbar />

      <main id="conteudo-principal">
        <Hero />


        <About />
        <Team />
        <Services />
        <Plans />
        <ProductDemo />
        <Contact />
        <HowItWorks />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  )
}
