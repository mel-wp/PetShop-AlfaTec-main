import { createClient } from "@/lib/supabase/server"
import { AppointmentsClient } from "./appointments-client"
import type { Appointment, Pet, Service } from "@/lib/types"

async function getAppointmentsData() {
  const supabase = await createClient()

  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      pet:pets(*, customer:customers(*)),
      service:services(*)
    `)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true })

  const { data: pets } = await supabase
    .from("pets")
    .select(`*, customer:customers(*)`)
    .order("name", { ascending: true })

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  return {
    appointments: (appointments || []) as Appointment[],
    pets: (pets || []) as Pet[],
    services: (services || []) as Service[],
  }
}

export default async function AgendamentosPage() {
  const { appointments, pets, services } = await getAppointmentsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
        <p className="text-muted-foreground">
          Gerencie os agendamentos de banho, tosa e consultas
        </p>
      </div>

      <AppointmentsClient 
        initialAppointments={appointments}
        pets={pets}
        services={services}
      />
    </div>
  )
}
