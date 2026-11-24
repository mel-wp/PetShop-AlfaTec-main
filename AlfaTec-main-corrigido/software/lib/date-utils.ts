// Datas no fuso LOCAL. toISOString() usa UTC: no Brasil (UTC-3), depois das 21h
// o "hoje" em UTC ja e o dia seguinte e as vendas/agendamentos do dia somem dos indicadores.
const pad = (n: number) => String(n).padStart(2, "0")

/** "YYYY-MM-DD" no fuso local */
export function localDateString(d: Date = new Date()): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Inicio do dia local (ISO UTC) */
export function startOfDayISO(d: Date = new Date()): string {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()
}

/** Inicio do dia seguinte local (ISO UTC), usar com .lt() */
export function startOfNextDayISO(d: Date = new Date()): string {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString()
}

/** Inicio do mes local (ISO UTC) */
export function startOfMonthISO(d: Date = new Date()): string {
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
}

/** "YYYY-MM-01" local */
export function startOfMonthDateString(d: Date = new Date()): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`
}
