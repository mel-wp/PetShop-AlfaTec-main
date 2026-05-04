"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Dog, Cat } from "lucide-react"
import type { Appointment } from "@/lib/types"

interface RecentAppointmentsProps {
  appointments: Appointment[]
}

const statusConfig = {
  scheduled: { label: "Agendado", variant: "secondary" as const },
  confirmed: { label: "Confirmado", variant: "default" as const },
  in_progress: { label: "Em Andamento", variant: "default" as const },
  completed: { label: "Concluído", variant: "outline" as const },
  cancelled: { label: "Cancelado", variant: "destructive" as const },
}

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamentos de Hoje</CardTitle>
        <CardDescription>
          {appointments.length} agendamentos para hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum agendamento para hoje
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const status = statusConfig[appointment.status]
              const PetIcon = appointment.pet?.species === "cat" ? Cat : Dog
              
              return (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <PetIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.pet?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.service?.name} - {appointment.pet?.customer?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {appointment.scheduled_time.slice(0, 5)}
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
