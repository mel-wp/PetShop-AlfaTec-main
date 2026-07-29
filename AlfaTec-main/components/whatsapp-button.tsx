import { MessageCircle } from "lucide-react"

const whatsappUrl = "https://wa.me/5549998765432?text=Olá!%20Quero%20agendar%20uma%20demonstração%20do%20sistema%20AlfaTec."

export function WhatsAppButton() {
  return (
    <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar com a AlfaTec pelo WhatsApp" className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#20bd5b] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30">
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
      <span className="sr-only">Falar pelo WhatsApp</span>
    </a>
  )
}
