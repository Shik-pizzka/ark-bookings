import { bookingData } from '../data/bookingData.js'

export function getBookingData(day = bookingData.current_day) {
  const selectedDay = bookingData.available_days.includes(day) ? day : bookingData.current_day

  return {
    available_days: bookingData.available_days,
    current_day: bookingData.current_day,
    selected_day: selectedDay,
    restaurant: bookingData.restaurant,
    tables: bookingData.tablesByDay[selectedDay]
  }
}
