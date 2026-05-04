import { createClient } from "@/lib/supabase/server"
import { PetsClient } from "./pets-client"
import type { Pet, Customer } from "@/lib/types"

async function getPetsData() {
  const supabase = await createClient()

  const { data: pets } = await supabase
    .from("pets")
    .select(`*, customer:customers(*)`)
    .order("name", { ascending: true })

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("name", { ascending: true })

  return {
    pets: (pets || []) as Pet[],
    customers: (customers || []) as Customer[],
  }
}

export default async function PetsPage() {
  const { pets, customers } = await getPetsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pets</h1>
        <p className="text-muted-foreground">
          Gerencie os pets cadastrados no sistema
        </p>
      </div>

      <PetsClient initialPets={pets} customers={customers} />
    </div>
  )
}
