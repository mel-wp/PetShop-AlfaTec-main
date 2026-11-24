"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package } from "lucide-react"
import type { Product } from "@/lib/types"

interface LowStockAlertProps {
  products: Product[]
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Alerta de Estoque Baixo
        </CardTitle>
        <CardDescription>
          Produtos que precisam ser repostos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">
              Todos os produtos estão com estoque adequado
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-3"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category?.name}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="border-warning text-warning">
                    {product.stock_quantity} un.
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mínimo: {product.min_stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
