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
import { PawPrint, Plus, Search, Dog, Cat, Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Pet, Customer } from "@/lib/types"

interface PetsClientProps {
  initialPets: Pet[]
  customers: Customer[]
}

export function PetsClient({ initialPets, customers }: PetsClientProps) {
  const [pets, setPets] = useState(initialPets)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSpecies, setFilterSpecies] = useState<string>("all")
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    customer_id: "",
    name: "",
    species: "dog" as "dog" | "cat",
    breed: "",
    birth_date: "",
    weight: "",
    notes: "",
  })

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = filterSpecies === "all" || pet.species === filterSpecies
    return matchesSearch && matchesSpecies
  })

  const resetForm = () => {
    setFormData({
      customer_id: "",
      name: "",
      species: "dog",
      breed: "",
      birth_date: "",
      weight: "",
      notes: "",
    })
    setEditingPet(null)
  }

  const openEditDialog = (pet: Pet) => {
    setEditingPet(pet)
    setFormData({
      customer_id: pet.customer_id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      birth_date: pet.birth_date || "",
      weight: pet.weight?.toString() || "",
      notes: pet.notes || "",
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const petData = {
      customer_id: formData.customer_id,
      name: formData.name,
      species: formData.species,
      breed: formData.breed || null,
      birth_date: formData.birth_date || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      notes: formData.notes || null,
    }

    if (editingPet) {
      const { data, error } = await supabase
        .from("pets")
        .update(petData)
        .eq("id", editingPet.id)
        .select(`*, customer:customers(*)`)
        .single()

      if (!error && data) {
        setPets(pets.map(p => p.id === editingPet.id ? data as Pet : p))
      }
    } else {
      const { data, error } = await supabase
        .from("pets")
        .insert(petData)
        .select(`*, customer:customers(*)`)
        .single()

      if (!error && data) {
        setPets([data as Pet, ...pets])
      }
    }

    setIsOpen(false)
    resetForm()
    setIsLoading(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pet?")) return

    const supabase = createClient()
    const { error } = await supabase
      .from("pets")
      .delete()
      .eq("id", id)

    if (!error) {
      setPets(pets.filter(p => p.id !== id))
    }
    router.refresh()
  }

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    const today = new Date()
    const years = today.getFullYear() - birth.getFullYear()
    const months = today.getMonth() - birth.getMonth()
    
    if (years > 0) {
      return `${years} ano${years > 1 ? 's' : ''}`
    } else if (months > 0) {
      return `${months} mes${months > 1 ? 'es' : ''}`
    }
    return 'Filhote'
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou tutor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:w-[250px]"
            />
          </div>
          <Select value={filterSpecies} onValueChange={setFilterSpecies}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Espécie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="dog">Cães</SelectItem>
              <SelectItem value="cat">Gatos</SelectItem>
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
              Novo Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPet ? "Editar Pet" : "Novo Pet"}
              </DialogTitle>
              <DialogDescription>
                {editingPet 
                  ? "Atualize os dados do pet" 
                  : "Preencha os dados para cadastrar um novo pet"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Tutor *</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, customer_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tutor" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome do Pet *</Label>
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
                    <Label htmlFor="species">Espécie *</Label>
                    <Select
                      value={formData.species}
                      onValueChange={(value: "dog" | "cat") =>
                        setFormData({ ...formData, species: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Cão</SelectItem>
                        <SelectItem value="cat">Gato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="breed">Raça</Label>
                    <Input
                      id="breed"
                      value={formData.breed}
                      onChange={(e) =>
                        setFormData({ ...formData, breed: e.target.value })
                      }
                      placeholder="Ex: Golden Retriever"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      placeholder="Ex: 12.5"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) =>
                      setFormData({ ...formData, birth_date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Alergias, comportamento, etc..."
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
            <PawPrint className="h-5 w-5" />
            Lista de Pets ({filteredPets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPets.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum pet encontrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pet</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Raça</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPets.map((pet) => {
                  const PetIcon = pet.species === "cat" ? Cat : Dog
                  const age = calculateAge(pet.birth_date)

                  return (
                    <TableRow key={pet.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <PetIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{pet.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {pet.species === "dog" ? "Cão" : "Gato"}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{pet.customer?.name}</TableCell>
                      <TableCell>{pet.breed || "-"}</TableCell>
                      <TableCell>{age || "-"}</TableCell>
                      <TableCell>
                        {pet.weight ? `${pet.weight} kg` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(pet)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(pet.id)}
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
