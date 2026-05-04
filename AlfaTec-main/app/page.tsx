import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Team } from "@/components/team"
import { Services } from "@/components/services"
import { Portfolio } from "@/components/portfolio"
import { Brand } from "@/components/brand"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Plans } from "@/components/planos"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        {/* BOTÃO */}
        <div className="flex justify-center mt-6">
          <Link href="/software">
            <Button>Acessar software</Button>
          </Link>
        </div>

        <About />
        <Team />
        <Services />
        <Plans />
        <Portfolio />
        <Brand />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
