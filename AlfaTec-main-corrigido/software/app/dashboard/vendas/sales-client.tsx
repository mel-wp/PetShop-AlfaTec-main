"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Trash2, 
  CreditCard, 
  Banknote,
  Smartphone,
  Package,
  Scissors
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Sale, Product, Service, Customer } from "@/lib/types"

interface CartItem {
  id: string
  type: "product" | "service"
  name: string
  quantity: number
  unit_price: number
  product_id?: string
  service_id?: string
}

interface SalesClientProps {
  initialSales: Sale[]
  products: Product[]
  services: Service[]
  customers: Customer[]
}

const statusConfig = {
  pending: { label: "Pendente", variant: "secondary" as const },
  completed: { label: "Concluída", variant: "default" as const },
  cancelled: { label: "Cancelada", variant: "destructive" as const },
}

const paymentMethodLabels = {
  cash: "Dinheiro",
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  pix: "PIX",
  other: "Outro",
}

export function SalesClient({ initialSales, products, services, customers }: SalesClientProps) {
  const [sales, setSales] = useState(initialSales)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")
  const [discount, setDiscount] = useState<string>("0")
  const [productSearch, setProductSearch] = useState("")
  const router = useRouter()

  const filteredSales = sales.filter((sale) =>
    sale.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  const discountAmount = parseFloat(discount) || 0
  const finalTotal = Math.max(0, cartTotal - discountAmount)

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product_id === product.id)
    if (existing) {
      setCart(cart.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        id: crypto.randomUUID(),
        type: "product",
        name: product.name,
        quantity: 1,
        unit_price: product.sale_price,
        product_id: product.id,
      }])
    }
  }

  const addServiceToCart = (service: Service) => {
    const existing = cart.find(item => item.service_id === service.id)
    if (existing) {
      setCart(cart.map(item => 
        item.service_id === service.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        id: crypto.randomUUID(),
        type: "service",
        name: service.name,
        quantity: 1,
        unit_price: service.price,
        service_id: service.id,
      }])
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id))
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const handleSubmit = async () => {
    if (cart.length === 0) return
    setIsLoading(true)

    const supabase = createClient()

    // Create sale
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .insert({
        customer_id: selectedCustomer || null,
        total_amount: finalTotal,
        discount_amount: discountAmount,
        payment_method: paymentMethod,
        status: "completed",
      })
      .select(`*, customer:customers(*)`)
      .single()

    if (saleError || !sale) {
      setIsLoading(false)
      return
    }

    // Create sale items
    const saleItems = cart.map(item => ({
      sale_id: sale.id,
      product_id: item.product_id || null,
      service_id: item.service_id || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
    }))

    await supabase.from("sale_items").insert(saleItems)

    // Update stock for products
    for (const item of cart) {
      if (item.product_id) {
        const product = products.find(p => p.id === item.product_id)
        if (product) {
          await supabase
            .from("products")
            .update({ stock_quantity: product.stock_quantity - item.quantity })
            .eq("id", item.product_id)
        }
      }
    }

    // Add to cash flow
    await supabase.from("cash_flow").insert({
      type: "income",
      category: "Venda",
      description: `Venda #${sale.id.slice(0, 8)}`,
      amount: finalTotal,
      date: new Date().toISOString().split("T")[0],
      reference_type: "sale",
      reference_id: sale.id,
    })

    setSales([sale as Sale, ...sales])
    setIsOpen(false)
    setCart([])
    setSelectedCustomer("")
    setPaymentMethod("cash")
    setDiscount("0")
    setIsLoading(false)
    router.refresh()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:w-[300px]"
          />
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
              <DialogDescription>
                Adicione produtos e serviços ao carrinho
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4 lg:grid-cols-2">
              {/* Product/Service Selection */}
              <div className="space-y-4">
                <Tabs defaultValue="products">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="products" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Produtos
                    </TabsTrigger>
                    <TabsTrigger value="services" className="flex items-center gap-2">
                      <Scissors className="h-4 w-4" />
                      Serviços
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="products" className="space-y-4">
                    <Input
                      placeholder="Buscar produto..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                    <div className="max-h-[300px] space-y-2 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                          onClick={() => addToCart(product)}
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Estoque: {product.stock_quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(product.sale_price)}</p>
                            <Button size="sm" variant="ghost">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="services" className="space-y-4">
                    <div className="max-h-[300px] space-y-2 overflow-y-auto">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                          onClick={() => addServiceToCart(service)}
                        >
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {service.duration_minutes} min
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(service.price)}</p>
                            <Button size="sm" variant="ghost">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Cart */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-5 w-5" />
                    Carrinho ({cart.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">
                      Carrinho vazio
                    </p>
                  ) : (
                    <div className="max-h-[200px] space-y-2 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg border p-2"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(item.unit_price)} un.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center"
                              min={1}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 border-t pt-4">
                    <div className="grid gap-2">
                      <Label>Cliente (opcional)</Label>
                      <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Forma de Pagamento</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={paymentMethod === "cash" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("cash")}
                          className="justify-start"
                        >
                          <Banknote className="mr-2 h-4 w-4" />
                          Dinheiro
                        </Button>
                        <Button
                          type="button"
                          variant={paymentMethod === "pix" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("pix")}
                          className="justify-start"
                        >
                          <Smartphone className="mr-2 h-4 w-4" />
                          PIX
                        </Button>
                        <Button
                          type="button"
                          variant={paymentMethod === "credit_card" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("credit_card")}
                          className="justify-start"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Crédito
                        </Button>
                        <Button
                          type="button"
                          variant={paymentMethod === "debit_card" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("debit_card")}
                          className="justify-start"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Débito
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Desconto</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 border-t pt-4">
                  <div className="flex w-full justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex w-full justify-between text-sm text-destructive">
                      <span>Desconto:</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex w-full justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? "Finalizando..." : "Finalizar Venda"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Histórico de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhuma venda encontrada
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => {
                  const status = statusConfig[sale.status]

                  return (
                    <TableRow key={sale.id}>
                      <TableCell>{formatDate(sale.created_at)}</TableCell>
                      <TableCell>{sale.customer?.name || "Cliente não identificado"}</TableCell>
                      <TableCell>{paymentMethodLabels[sale.payment_method]}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(sale.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
