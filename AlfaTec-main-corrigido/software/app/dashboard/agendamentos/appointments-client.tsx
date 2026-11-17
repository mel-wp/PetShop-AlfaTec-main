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
import { Calendar, Plus, Clock, Dog, Cat, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Appointment, Pet, Service } from "@/lib/types"

interface AppointmentsClientProps {
  initialAppointments: Appointment[]
  pets: Pet[]
  services: Service[]
}

const statusConfig = {
  scheduled: { label: "Agendado", variant: "secondary" as const },
  confirmed: { label: "Confirmado", variant: "default" as const },
  in_progress: { label: "Em Andamento", variant: "default" as const },
  completed: { label: "Concluído", variant: "outline" as const },
  cancelled: { label: "Cancelado", variant: "destructive" as const },
}

export function AppointmentsClient({ initialAppointments, pets, services }: AppointmentsClientProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filterDate, setFilterDate] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    pet_id: "",
    service_id: "",
    scheduled_date: "",
    scheduled_time: "",
    notes: "",
  })

  const filteredAppointments = appointments.filter((apt) => {
    if (filterDate && apt.scheduled_date !== filterDate) return false
    if (filterStatus !== "all" && apt.status !== filterStatus) return false
    return true
  })

  const CONFLICT_MESSAGE =
    "Já existe um atendimento agendado para esta data e horário. Escolha outro horário."

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // 1) Confere na lista que já está na tela
    const localConflict = appointments.some(
      (apt) =>
        apt.scheduled_date === formData.scheduled_date &&
        apt.scheduled_time.slice(0, 5) === formData.scheduled_time.slice(0, 5) &&
        apt.status !== "cancelled"
    )
    if (localConflict) {
      setFormError(CONFLICT_MESSAGE)
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const selectedService = services.find(s => s.id === formData.service_id)

    // 2) Confere no banco (a lista da tela pode estar desatualizada)
    const { data: existing, error: checkError } = await supabase
      .from("appointments")
      .select("id")
      .eq("scheduled_date", formData.scheduled_date)
      .eq("scheduled_time", formData.scheduled_time)
      .neq("status", "cancelled")
      .limit(1)

    if (checkError) {
      setFormError("Não foi possível verificar a disponibilidade. Tente novamente.")
      setIsLoading(false)
      return
    }
    if (existing && existing.length > 0) {
      setFormError(CONFLICT_MESSAGE)
      setIsLoading(false)
      return
    }

    // 3) Salva (mesmo código de antes)
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        pet_id: formData.pet_id,
        service_id: formData.service_id,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        notes: formData.notes || null,
        total_price: selectedService?.price || 0,
        status: "scheduled",
      })
      .select(`
        *,
        pet:pets(*, customer:customers(*)),
        service:services(*)
      `)
      .single()

    if (error) {
      console.error("Erro ao salvar agendamento:", error)
      setFormError(`Erro ao salvar o agendamento: ${error.message}`)
      setIsLoading(false)
      return
    }

    if (data) {
      setAppointments([data as Appointment, ...appointments])
      setIsOpen(false)
      setFormData({
        pet_id: "",
        service_id: "",
        scheduled_date: "",
        scheduled_time: "",
        notes: "",
      })
    }

    setIsLoading(false)
    router.refresh()
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const supabase = createClient()

    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id)

    if (!error) {
      setAppointments(appointments.map(apt =>
        apt.id === id ? { ...apt, status: newStatus as Appointment["status"] } : apt
      ))
    }
    router.refresh()
  }

  const formatDate = (date: string) => {
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-auto"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          {(filterDate || filterStatus !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterDate("")
                setFilterStatus("all")
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setFormError(null) }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo agendamento
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="pet">Pet</Label>
                  <Select
                    value={formData.pet_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, pet_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name} ({pet.customer?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service">Serviço</Label>
                  <Select
                    value={formData.service_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, service_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {formatCurrency(service.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) =>
                        setFormData({ ...formData, scheduled_date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.scheduled_time}
                      onChange={(e) =>
                        setFormData({ ...formData, scheduled_time: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Observações opcionais..."
                  />
                </div>
                {formError && (
                  <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {formError}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
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
            <Calendar className="h-5 w-5" />
            Lista de Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum agendamento encontrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  const status = statusConfig[appointment.status]
                  const PetIcon = appointment.pet?.species === "cat" ? Cat : Dog

                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatDate(appointment.scheduled_date)}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {appointment.scheduled_time.slice(0, 5)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PetIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.pet?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.pet?.customer?.name}</TableCell>
                      <TableCell>{appointment.service?.name}</TableCell>
                      <TableCell>{formatCurrency(appointment.total_price)}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={appointment.status}
                          onValueChange={(value) => updateStatus(appointment.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Agendado</SelectItem>
                            <SelectItem value="confirmed">Confirmado</SelectItem>
                            <SelectItem value="in_progress">Em Andamento</SelectItem>
                            <SelectItem value="completed">Concluído</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
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
