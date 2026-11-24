import { createClient } from "@/lib/supabase/server"
import { FinanceClient } from "./finance-client"
import type { AccountPayable, AccountReceivable, CashFlow } from "@/lib/types"

async function getFinanceData() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0]

  const { data: accountsPayable } = await supabase
    .from("accounts_payable")
    .select("*")
    .order("due_date", { ascending: true })

  const { data: accountsReceivable } = await supabase
    .from("accounts_receivable")
    .select(`*, customer:customers(*)`)
    .order("due_date", { ascending: true })

  const { data: cashFlow } = await supabase
    .from("cash_flow")
    .select("*")
    .gte("date", startOfMonth)
    .order("date", { ascending: false })

  // Calculate totals
  const { data: monthlyIncome } = await supabase
    .from("cash_flow")
    .select("amount")
    .eq("type", "income")
    .gte("date", startOfMonth)

  const { data: monthlyExpense } = await supabase
    .from("cash_flow")
    .select("amount")
    .eq("type", "expense")
    .gte("date", startOfMonth)

  const { data: pendingPayables } = await supabase
    .from("accounts_payable")
    .select("amount")
    .eq("status", "pending")

  const { data: pendingReceivables } = await supabase
    .from("accounts_receivable")
    .select("amount")
    .eq("status", "pending")

  const totalIncome = monthlyIncome?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalExpense = monthlyExpense?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalPendingPayables = pendingPayables?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalPendingReceivables = pendingReceivables?.reduce((sum, item) => sum + Number(item.amount), 0) || 0

  return {
    accountsPayable: (accountsPayable || []) as AccountPayable[],
    accountsReceivable: (accountsReceivable || []) as AccountReceivable[],
    cashFlow: (cashFlow || []) as CashFlow[],
    summary: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalPendingPayables,
      totalPendingReceivables,
    }
  }
}

export default async function FinanceiroPage() {
  const { accountsPayable, accountsReceivable, cashFlow, summary } = await getFinanceData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground">
          Controle de contas, fluxo de caixa e relatórios
        </p>
      </div>

      <FinanceClient 
        accountsPayable={accountsPayable}
        accountsReceivable={accountsReceivable}
        cashFlow={cashFlow}
        summary={summary}
      />
    </div>
  )
}
