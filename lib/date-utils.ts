export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR")
}

export function formatTime(time: string): string {
  return time.slice(0, 5) // Remove segundos se houver
}

export function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60)
  const newMins = totalMinutes % 60
  return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`
}

export function isTimeSlotAvailable(
  startTime: string,
  endTime: string,
  existingAppointments: Array<{ horaInicio: string; horaFim: string }>,
): boolean {
  for (const appointment of existingAppointments) {
    // Verifica se há sobreposição
    if (
      (startTime >= appointment.horaInicio && startTime < appointment.horaFim) ||
      (endTime > appointment.horaInicio && endTime <= appointment.horaFim) ||
      (startTime <= appointment.horaInicio && endTime >= appointment.horaFim)
    ) {
      return false
    }
  }
  return true
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
  existingAppointments: Array<{ horaInicio: string; horaFim: string }> = [],
): string[] {
  const slots: string[] = []
  let currentTime = startTime

  while (currentTime < endTime) {
    const slotEndTime = addMinutes(currentTime, duration)

    if (slotEndTime <= endTime && isTimeSlotAvailable(currentTime, slotEndTime, existingAppointments)) {
      slots.push(currentTime)
    }

    currentTime = addMinutes(currentTime, 30) // Intervalos de 30 minutos
  }

  return slots
}
