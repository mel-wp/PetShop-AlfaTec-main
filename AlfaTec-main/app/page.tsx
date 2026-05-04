import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Team } from "@/components/team"
import { Services } from "@/components/services"
import { Portfolio } from "@/components/portfolio"
import { Brand } from "@/components/brand"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Team />
        <Services />
        <Portfolio />
        <Brand />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
