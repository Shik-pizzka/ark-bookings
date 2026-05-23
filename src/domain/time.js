export function parseClock(value) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatClock(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function minutesFromIso(value) {
  const date = new Date(value)
  return date.getHours() * 60 + date.getMinutes()
}

export function makeTimeMarks(openingTime, closingTime, step = 30) {
  const start = parseClock(openingTime)
  const end = parseClock(closingTime)
  const marks = []

  for (let time = start; time <= end; time += step) {
    marks.push({ value: time, label: formatClock(time) })
  }

  return marks
}

export function getRestaurantTime(timezone) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date())
}
