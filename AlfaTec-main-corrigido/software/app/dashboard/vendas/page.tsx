import { createClient } from "@/lib/supabase/server"
import { SalesClient } from "./sales-client"
import type { Sale, Product, Service, Customer } from "@/lib/types"

async function getSalesData() {
  const supabase = await createClient()

  const { data: sales } = await supabase
    .from("sales")
    .select(`*, customer:customers(*)`)
    .order("created_at", { ascending: false })
    .limit(100)

  const { data: products } = await supabase
    .from("products")
    .select(`*, category:product_categories(*)`)
    .eq("is_active", true)
    .gt("stock_quantity", 0)
    .order("name", { ascending: true })

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("name", { ascending: true })

  return {
    sales: (sales || []) as Sale[],
    products: (products || []) as Product[],
    services: (services || []) as Service[],
    customers: (customers || []) as Customer[],
  }
}

export default async function VendasPage() {
  const { sales, products, services, customers } = await getSalesData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
        <p className="text-muted-foreground">
          Registre vendas e gerencie o ponto de venda
        </p>
      </div>

      <SalesClient 
        initialSales={sales}
        products={products}
        services={services}
        customers={customers}
      />
    </div>
  )
}
