"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { AccountPayable, AccountReceivable, CashFlow } from "@/lib/types"

interface FinanceClientProps {
  accountsPayable: AccountPayable[]
  accountsReceivable: AccountReceivable[]
  cashFlow: CashFlow[]
  summary: {
    totalIncome: number
    totalExpense: number
    balance: number
    totalPendingPayables: number
    totalPendingReceivables: number
  }
}

const payableStatusConfig = {
  pending: { label: "Pendente", variant: "secondary" as const, icon: AlertCircle },
  paid: { label: "Pago", variant: "default" as const, icon: CheckCircle },
  overdue: { label: "Atrasado", variant: "destructive" as const, icon: AlertCircle },
  cancelled: { label: "Cancelado", variant: "outline" as const, icon: AlertCircle },
}

const receivableStatusConfig = {
  pending: { label: "Pendente", variant: "secondary" as const },
  received: { label: "Recebido", variant: "default" as const },
  overdue: { label: "Atrasado", variant: "destructive" as const },
  cancelled: { label: "Cancelado", variant: "outline" as const },
}

export function FinanceClient({ accountsPayable, accountsReceivable, cashFlow, summary }: FinanceClientProps) {
  const [payables, setPayables] = useState(accountsPayable)
  const [receivables, setReceivables] = useState(accountsReceivable)
  const [isPayableOpen, setIsPayableOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [payableForm, setPayableForm] = useState({
    description: "",
    supplier: "",
    amount: "",
    due_date: "",
    category: "",
    notes: "",
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR")
  }

  const handleAddPayable = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("accounts_payable")
      .insert({
        description: payableForm.description,
        supplier: payableForm.supplier || null,
        amount: parseFloat(payableForm.amount),
        due_date: payableForm.due_date,
        category: payableForm.category || null,
        notes: payableForm.notes || null,
        status: "pending",
      })
      .select()
      .single()

    if (!error && data) {
      setPayables([data as AccountPayable, ...payables])
      setIsPayableOpen(false)
      setPayableForm({
        description: "",
        supplier: "",
        amount: "",
        due_date: "",
        category: "",
        notes: "",
      })
    }

    setIsLoading(false)
    router.refresh()
  }

  const markAsPaid = async (id: string) => {
    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]
    const payable = payables.find(p => p.id === id)

    const { error } = await supabase
      .from("accounts_payable")
      .update({ status: "paid", paid_date: today })
      .eq("id", id)

    if (!error && payable) {
      // Add to cash flow
      await supabase.from("cash_flow").insert({
        type: "expense",
        category: payable.category || "Outros",
        description: payable.description,
        amount: payable.amount,
        date: today,
        reference_type: "account_payable",
        reference_id: id,
      })

      setPayables(payables.map(p => 
        p.id === id ? { ...p, status: "paid" as const, paid_date: today } : p
      ))
    }
    router.refresh()
  }

  const markAsReceived = async (id: string) => {
    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]
    const receivable = receivables.find(r => r.id === id)

    const { error } = await supabase
      .from("accounts_receivable")
      .update({ status: "received", received_date: today })
      .eq("id", id)

    if (!error && receivable) {
      // Add to cash flow
      await supabase.from("cash_flow").insert({
        type: "income",
        category: "Recebimento",
        description: receivable.description,
        amount: receivable.amount,
        date: today,
        reference_type: "account_receivable",
        reference_id: id,
      })

      setReceivables(receivables.map(r => 
        r.id === id ? { ...r, status: "received" as const, received_date: today } : r
      ))
    }
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-success/10 p-3">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receitas do Mês</p>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-destructive/10 p-3">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Despesas do Mês</p>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(summary.totalExpense)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg p-3 ${summary.balance >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <Wallet className={`h-6 w-6 ${summary.balance >= 0 ? 'text-success' : 'text-destructive'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo do Mês</p>
              <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-warning/10 p-3">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contas a Pagar</p>
              <p className="text-2xl font-bold">
                {formatCurrency(summary.totalPendingPayables)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payables" className="flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4" />
            Contas a Pagar
          </TabsTrigger>
          <TabsTrigger value="receivables" className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Contas a Receber
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Fluxo de Caixa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payables">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowDownRight className="h-5 w-5 text-destructive" />
                Contas a Pagar
              </CardTitle>
              <Dialog open={isPayableOpen} onOpenChange={setIsPayableOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Conta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nova Conta a Pagar</DialogTitle>
                    <DialogDescription>
                      Registre uma nova despesa ou conta
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPayable}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição *</Label>
                        <Input
                          id="description"
                          value={payableForm.description}
                          onChange={(e) =>
                            setPayableForm({ ...payableForm, description: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="supplier">Fornecedor</Label>
                          <Input
                            id="supplier"
                            value={payableForm.supplier}
                            onChange={(e) =>
                              setPayableForm({ ...payableForm, supplier: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Categoria</Label>
                          <Select
                            value={payableForm.category}
                            onValueChange={(value) =>
                              setPayableForm({ ...payableForm, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Aluguel">Aluguel</SelectItem>
                              <SelectItem value="Energia">Energia</SelectItem>
                              <SelectItem value="Água">Água</SelectItem>
                              <SelectItem value="Internet">Internet</SelectItem>
                              <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                              <SelectItem value="Salários">Salários</SelectItem>
                              <SelectItem value="Impostos">Impostos</SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Valor *</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={payableForm.amount}
                            onChange={(e) =>
                              setPayableForm({ ...payableForm, amount: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="due_date">Vencimento *</Label>
                          <Input
                            id="due_date"
                            type="date"
                            value={payableForm.due_date}
                            onChange={(e) =>
                              setPayableForm({ ...payableForm, due_date: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                          id="notes"
                          value={payableForm.notes}
                          onChange={(e) =>
                            setPayableForm({ ...payableForm, notes: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsPayableOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {payables.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Nenhuma conta a pagar
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payables.map((payable) => {
                      const status = payableStatusConfig[payable.status]
                      const isOverdue = payable.status === "pending" && 
                        new Date(payable.due_date) < new Date()

                      return (
                        <TableRow key={payable.id}>
                          <TableCell className="font-medium">{payable.description}</TableCell>
                          <TableCell>{payable.supplier || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payable.category || "Outros"}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(payable.due_date)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-destructive">
                            {formatCurrency(payable.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={isOverdue ? "destructive" : status.variant}>
                              {isOverdue ? "Atrasado" : status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {payable.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsPaid(payable.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Pagar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receivables">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-success" />
                Contas a Receber
              </CardTitle>
            </CardHeader>
            <CardContent>
              {receivables.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Nenhuma conta a receber
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivables.map((receivable) => {
                      const status = receivableStatusConfig[receivable.status]

                      return (
                        <TableRow key={receivable.id}>
                          <TableCell className="font-medium">{receivable.description}</TableCell>
                          <TableCell>{receivable.customer?.name || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(receivable.due_date)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-success">
                            {formatCurrency(receivable.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {receivable.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsReceived(receivable.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Receber
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Fluxo de Caixa do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cashFlow.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Nenhuma movimentação neste mês
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlow.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell>
                          <Badge variant={entry.type === "income" ? "default" : "destructive"}>
                            {entry.type === "income" ? "Entrada" : "Saída"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.category}</Badge>
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell className={`text-right font-medium ${entry.type === "income" ? "text-success" : "text-destructive"}`}>
                          {entry.type === "income" ? "+" : "-"}{formatCurrency(entry.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
