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
import { Package, Plus, Search, AlertTriangle, Edit, Trash2, TrendingDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Product, ProductCategory } from "@/lib/types"

interface InventoryClientProps {
  initialProducts: Product[]
  categories: ProductCategory[]
}

export function InventoryClient({ initialProducts: products, categories }: InventoryClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stockError, setStockError] = useState("")
  const [formError, setFormError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStock, setFilterStock] = useState<string>("all")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    sku: "",
    barcode: "",
    cost_price: "",
    sale_price: "",
    stock_quantity: "",
    min_stock: "",
  })

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm)
    const matchesCategory = filterCategory === "all" || product.category_id === filterCategory
    const isLowStock = product.stock_quantity <= product.min_stock
    const matchesStock = 
      filterStock === "all" || 
      (filterStock === "low" && isLowStock) ||
      (filterStock === "ok" && !isLowStock)
    return matchesSearch && matchesCategory && matchesStock
  })

  const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock).length

  const resetForm = () => {
    setFormError("")
    setFormData({
      category_id: "",
      name: "",
      description: "",
      sku: "",
      barcode: "",
      cost_price: "",
      sale_price: "",
      stock_quantity: "",
      min_stock: "",
    })
    setEditingProduct(null)
  }

  const openEditDialog = (product: Product) => {
    setFormError("")
    setEditingProduct(product)
    setFormData({
      category_id: product.category_id || "",
      name: product.name,
      description: product.description || "",
      sku: product.sku || "",
      barcode: product.barcode || "",
      cost_price: product.cost_price.toString(),
      sale_price: product.sale_price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      min_stock: product.min_stock.toString(),
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const quantity = Number(formData.stock_quantity)
    if (formData.stock_quantity === "" || !Number.isInteger(quantity) || quantity < 0) {
      setFormError("Informe uma quantidade inteira maior ou igual a zero.")
      return
    }
    setFormError("")
    setIsLoading(true)

    const supabase = createClient()
    const productData = {
      category_id: formData.category_id || null,
      name: formData.name,
      description: formData.description || null,
      sku: formData.sku || null,
      barcode: formData.barcode || null,
      cost_price: parseFloat(formData.cost_price),
      sale_price: parseFloat(formData.sale_price),
      stock_quantity: quantity,
      min_stock: parseInt(formData.min_stock),
    }

    const query = editingProduct
      ? supabase.from("products").update(productData)
        .eq("id", editingProduct.id)
        .eq("stock_quantity", editingProduct.stock_quantity)
      : supabase.from("products").insert(productData)

    const { data, error } = await query.select("id").maybeSingle()
    setIsLoading(false)

    if (error || !data) {
      setFormError(error
        ? "Não foi possível salvar o produto. Confira os dados e tente novamente."
        : "O estoque mudou. Feche e reabra a edição para conferir o saldo atual.")
      router.refresh()
      return
    }

    setIsOpen(false)
    resetForm()
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    const supabase = createClient()
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) return
    router.refresh()
  }

  const updateStock = async (product: Product, input: HTMLInputElement) => {
    const quantity = input.valueAsNumber
    input.value = String(product.stock_quantity)
    setStockError("")

    if (!Number.isInteger(quantity) || quantity < 0) {
      setStockError("Informe uma quantidade inteira maior ou igual a zero.")
      return
    }
    if (quantity === product.stock_quantity) return

    const supabase = createClient()
    const { data, error } = await supabase
      .from("products")
      .update({ stock_quantity: quantity })
      .eq("id", product.id)
      .eq("stock_quantity", product.stock_quantity)
      .select("id")
      .maybeSingle()

    if (error || !data) {
      setStockError(error
        ? "Não foi possível salvar o estoque. Tente novamente."
        : "O estoque mudou. Confira o saldo atualizado antes de editar novamente.")
    }
    router.refresh()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {stockError && <p role="alert" className="text-sm text-destructive">{stockError}</p>}
      {lowStockCount > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <div>
              <p className="font-medium">Alerta de Estoque Baixo</p>
              <p className="text-sm text-muted-foreground">
                {lowStockCount} produto(s) precisam ser repostos
              </p>
            </div>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => setFilterStock("low")}
            >
              Ver Produtos
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, SKU ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:w-[250px]"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStock} onValueChange={setFilterStock}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="low">Estoque Baixo</SelectItem>
              <SelectItem value="ok">Estoque OK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? "Atualize os dados do produto" 
                  : "Preencha os dados para cadastrar um novo produto"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome do Produto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="Código interno"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="barcode">Código de Barras</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cost_price">Preço de Custo *</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) =>
                        setFormData({ ...formData, cost_price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sale_price">Preço de Venda *</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      step="0.01"
                      value={formData.sale_price}
                      onChange={(e) =>
                        setFormData({ ...formData, sale_price: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock_quantity">Quantidade em Estoque *</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min={0}
                      value={formData.stock_quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, stock_quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="min_stock">Estoque Mínimo *</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={formData.min_stock}
                      onChange={(e) =>
                        setFormData({ ...formData, min_stock: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
              {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsOpen(false)
                  resetForm()
                }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produtos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum produto encontrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Venda</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const isLowStock = product.stock_quantity <= product.min_stock

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.sku && (
                            <p className="text-xs text-muted-foreground">
                              SKU: {product.sku}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.category?.name || "Sem categoria"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(product.cost_price)}</TableCell>
                      <TableCell>{formatCurrency(product.sale_price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isLowStock && (
                            <TrendingDown className="h-4 w-4 text-warning" />
                          )}
                          <Input
                            key={product.stock_quantity}
                            type="number"
                            aria-label={`Estoque de ${product.name}`}
                            min={0}
                            defaultValue={product.stock_quantity}
                            onBlur={(e) => updateStock(product, e.currentTarget)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.currentTarget.blur()
                            }}
                            className={`w-20 ${isLowStock ? 'border-warning' : ''}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            / {product.min_stock}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
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
