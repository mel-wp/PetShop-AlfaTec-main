import { createClient } from "@/lib/supabase/server"
import { InventoryClient } from "./inventory-client"
import type { Product, ProductCategory } from "@/lib/types"

async function getInventoryData() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`*, category:product_categories(*)`)
    .order("name", { ascending: true })

  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .order("name", { ascending: true })

  return {
    products: (products || []) as Product[],
    categories: (categories || []) as ProductCategory[],
  }
}

export default async function EstoquePage() {
  const { products, categories } = await getInventoryData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
        <p className="text-muted-foreground">
          Gerencie os produtos e controle o estoque
        </p>
      </div>

      <InventoryClient initialProducts={products} categories={categories} />
    </div>
  )
}
