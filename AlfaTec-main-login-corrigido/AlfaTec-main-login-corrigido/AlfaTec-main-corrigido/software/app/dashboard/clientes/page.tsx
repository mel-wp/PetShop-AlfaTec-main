import { createClient } from "@/lib/supabase/server"
import { CustomersClient } from "./customers-client"
import type { Customer } from "@/lib/types"

async function getCustomersData() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("name", { ascending: true })

  return {
    customers: (customers || []) as Customer[],
  }
}

export default async function ClientesPage() {
  const { customers } = await getCustomersData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie os dados dos tutores dos pets
        </p>
      </div>

      <CustomersClient initialCustomers={customers} />
    </div>
  )
}
