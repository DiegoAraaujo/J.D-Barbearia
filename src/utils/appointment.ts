export type ScheduleValidation = "valid" | "invalid" | "past" | "unavailable"

const weeklyRanges: Record<number, Array<[number, number]>> = {
  0: [[360, 780]],
  1: [[1080, 1230]],
  2: [[1080, 1230]],
  3: [[1080, 1230]],
  4: [[360, 510], [960, 1020]],
  5: [[360, 510], [960, 1080]],
  6: [[360, 1200]],
}

const brazilDateParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""

  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
  }
}

export const getBrazilToday = () => brazilDateParts().date

export const normalizeBrazilianPhone = (phone: string) => {
  let digits = phone.replace(/\D/g, "")
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2)
  return digits
}

export const isValidBrazilianPhone = (phone: string) =>
  /^(?!0{2})\d{10,11}$/.test(normalizeBrazilianPhone(phone))

export const whatsappNumber = (phone: string) => `55${normalizeBrazilianPhone(phone)}`

export const validateSchedule = (date: string, time: string): ScheduleValidation => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return "invalid"

  const [year, month, day] = date.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day, 12))
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day || hour > 23 || minute > 59) return "invalid"

  const selectedMinutes = hour * 60 + minute
  const now = brazilDateParts()
  if (date < now.date || (date === now.date && selectedMinutes <= now.minutes)) return "past"

  const ranges = weeklyRanges[parsed.getUTCDay()] ?? []
  return ranges.some(([start, end]) => selectedMinutes >= start && selectedMinutes <= end) ? "valid" : "unavailable"
}

export const formatDatePtBr = (date: string) => {
  const [year, month, day] = date.split("-")
  return `${day}/${month}/${year}`
}
