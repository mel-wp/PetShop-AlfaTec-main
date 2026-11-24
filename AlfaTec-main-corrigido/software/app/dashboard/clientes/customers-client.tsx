"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Plus, Search, Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Customer } from "@/lib/types"

interface CustomersClientProps {
  initialCustomers: Customer[]
}

export function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const [customers, setCustomers] = useState(initialCustomers)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    address: "",
  })

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      cpf: "",
      address: "",
    })
    setEditingCustomer(null)
  }

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone,
      cpf: customer.cpf || "",
      address: customer.address || "",
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    const supabase = createClient()

    if (editingCustomer) {
      const { data, error } = await supabase
        .from("customers")
        .update({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          cpf: formData.cpf || null,
          address: formData.address || null,
        })
        .eq("id", editingCustomer.id)
        .select()
        .single()

      if (!error && data) {
        setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...data } as Customer : c))
      } else {
        setErrorMessage(error?.message || "Não foi possível atualizar o cliente.")
        setIsLoading(false)
        return
      }
    } else {
      const { data, error } = await supabase
        .from("customers")
        .insert({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          cpf: formData.cpf || null,
          address: formData.address || null,
        })
        .select()
        .single()

      if (!error && data) {
        setCustomers([data as Customer, ...customers])
      } else {
        setErrorMessage(error?.message || "Não foi possível cadastrar o cliente.")
        setIsLoading(false)
        return
      }
    }

    setIsOpen(false)
    resetForm()
    setIsLoading(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return

    setErrorMessage("")
    const supabase = createClient()
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id)

    if (!error) {
      setCustomers(customers.filter(c => c.id !== id))
    } else {
      setErrorMessage(error.message || "Não foi possível excluir o cliente.")
    }
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:w-[300px]"
          />
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
              <DialogDescription>
                {editingCustomer
                  ? "Atualize os dados do cliente"
                  : "Preencha os dados para cadastrar um novo cliente"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {editingCustomer && (
                  <div className="grid gap-2">
                    <Label>Animais vinculados</Label>
                    <p className="text-sm text-muted-foreground">
                      {editingCustomer.pets?.length
                        ? editingCustomer.pets.map((pet) => pet.name).join(", ")
                        : "Nenhum animal cadastrado para este cliente."}
                    </p>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, cpf: e.target.value })
                      }
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Rua, número, bairro..."
                  />
                </div>
              </div>
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
            <Users className="h-5 w-5" />
            Lista de Clientes ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum cliente encontrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Animais</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {customer.email}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {customer.pets?.length
                        ? customer.pets.map((pet) => pet.name).join(", ")
                        : <span className="text-muted-foreground">Nenhum animal</span>}
                    </TableCell>
                    <TableCell>
                      {customer.address && (
                        <div className="flex items-center gap-2 max-w-[200px] truncate">
                          <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <span className="truncate">{customer.address}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
