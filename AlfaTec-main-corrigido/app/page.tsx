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
      <Navbar />

      <main>
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
