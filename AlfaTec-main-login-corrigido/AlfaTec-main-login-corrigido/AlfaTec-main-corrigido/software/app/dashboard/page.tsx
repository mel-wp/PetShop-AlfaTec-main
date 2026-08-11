import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import type { DashboardStats, Appointment, Product } from "@/lib/types"

async function getDashboardData() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0]

  // Get today's appointments count
  const { count: todayAppointments } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("scheduled_date", today)

  // Get today's appointments with details
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      pet:pets(*, customer:customers(*)),
      service:services(*)
    `)
    .eq("scheduled_date", today)
    .order("scheduled_time", { ascending: true })
    .limit(10)

  // Get today's revenue from completed sales
  const { data: todaySales } = await supabase
    .from("sales")
    .select("total_amount")
    .eq("status", "completed")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)

  const todayRevenue = todaySales?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0

  // Get low stock products
  const { data: lowStockProducts, count: lowStockCount } = await supabase
    .from("products")
    .select(`*, category:product_categories(*)`, { count: "exact" })
    .eq("is_active", true)
    .limit(100)

  // Filter products where stock is below minimum
  const filteredLowStock = lowStockProducts?.filter(
    (p) => p.stock_quantity <= p.min_stock
  ).slice(0, 5) || []

  // Get pending payables
  const { count: pendingPayables } = await supabase
    .from("accounts_payable")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  // Get monthly revenue
  const { data: monthlySales } = await supabase
    .from("sales")
    .select("total_amount")
    .eq("status", "completed")
    .gte("created_at", `${startOfMonth}T00:00:00`)

  const monthlyRevenue = monthlySales?.reduce(
    (sum, sale) => sum + Number(sale.total_amount),
    0
  ) || 0

  // Get monthly expenses
  const { data: monthlyPayables } = await supabase
    .from("accounts_payable")
    .select("amount")
    .eq("status", "paid")
    .gte("paid_date", startOfMonth)

  const monthlyExpenses = monthlyPayables?.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  ) || 0

  // Get total customers
  const { count: totalCustomers } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })

  // Get total pets
  const { count: totalPets } = await supabase
    .from("pets")
    .select("*", { count: "exact", head: true })

  const stats: DashboardStats = {
    todayAppointments: todayAppointments || 0,
    todayRevenue,
    lowStockProducts: filteredLowStock.length,
    pendingPayables: pendingPayables || 0,
    monthlyRevenue,
    monthlyExpenses,
    totalCustomers: totalCustomers || 0,
    totalPets: totalPets || 0,
  }

  return {
    stats,
    appointments: (appointments || []) as Appointment[],
    lowStockProducts: filteredLowStock as Product[],
  }
}

export default async function DashboardPage() {
  const { stats, appointments, lowStockProducts } = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu pet shop
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentAppointments appointments={appointments} />
        <LowStockAlert products={lowStockProducts} />
      </div>
    </div>
  )
}
