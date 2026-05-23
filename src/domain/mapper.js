import { minutesFromIso } from './time.js'

const orderTitles = {
  New: 'Заказ',
  Bill: 'Счёт',
  Closed: 'Заказ',
  Banquet: 'Банкет'
}

export function mapTableEvents(table) {
  const orders = table.orders.map((order) => ({
    id: order.id,
    tableId: table.id,
    tableNumber: table.number,
    zone: table.zone,
    type: 'order',
    title: orderTitles[order.status] || 'Заказ',
    status: order.status,
    start: minutesFromIso(order.start_time),
    end: minutesFromIso(order.end_time),
    guest: '',
    people: null,
    phone: ''
  }))

  const reservations = table.reservations.map((reservation) => ({
    id: String(reservation.id),
    tableId: table.id,
    tableNumber: table.number,
    zone: table.zone,
    type: 'reservation',
    title: reservation.status === 'Живая очередь' ? 'Живая очередь' : 'Бронь',
    status: reservation.status,
    start: minutesFromIso(reservation.seating_time),
    end: minutesFromIso(reservation.end_time),
    guest: reservation.name_for_reservation,
    people: reservation.num_people,
    phone: reservation.phone_number
  }))

  return [...orders, ...reservations].filter((event) => event.end > event.start)
}

export function mapEventsByTable(tables) {
  return Object.fromEntries(tables.map((table) => [table.id, mapTableEvents(table)]))
}
