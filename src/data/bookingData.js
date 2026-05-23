const days = ['2025-04-04', '2025-04-05', '2025-04-06', '2025-04-07', '2025-04-08']
const zones = ['1 этаж', '2 этаж', 'Банкетный зал']
const names = ['Алина', 'Миша', 'Антон', 'Марина', 'Олег', 'Ирина', 'Максим', 'Сергей', 'Анна', 'Денис', 'Ольга', 'Виктор']

const tablesTemplate = [
  ['5', 2, '1 этаж'], ['6', 4, '1 этаж'], ['15', 4, '1 этаж'], ['19', 2, '1 этаж'], ['20', 6, '2 этаж'],
  ['21', 2, '2 этаж'], ['22', 3, '2 этаж'], ['23', 4, '2 этаж'], ['24', 4, '2 этаж'], ['25', 4, '2 этаж'],
  ['26', 4, '2 этаж'], ['27', 4, '2 этаж'], ['28', 4, '2 этаж'], ['29', 4, '2 этаж'], ['30', 4, '2 этаж'],
  ['31', 4, '2 этаж'], ['33', 4, '2 этаж'], ['34', 4, '2 этаж'], ['36', 4, '2 этаж'], ['37', 4, '2 этаж'],
  ['38', 4, '2 этаж'], ['39', 4, '2 этаж'], ['40', 4, '2 этаж'], ['41', 4, '2 этаж'], ['Б1', 10, 'Банкетный зал'],
  ['Б2', 12, 'Банкетный зал'], ['Б3', 14, 'Банкетный зал']
]

function at(day, time) {
  return `${day}T${time}:00.000+10:00`
}

function id(dayIndex, tableIndex, type, index) {
  return `${type}-${dayIndex + 1}-${tableIndex + 1}-${index + 1}`
}

function order(day, dayIndex, tableIndex, index, status, start, end) {
  return {
    id: id(dayIndex, tableIndex, 'order', index),
    status,
    start_time: at(day, start),
    end_time: at(day, end)
  }
}

function reservation(day, dayIndex, tableIndex, index, status, start, end, nameIndex, people) {
  return {
    id: 1000 + dayIndex * 300 + tableIndex * 10 + index,
    name_for_reservation: names[nameIndex % names.length],
    num_people: people,
    phone_number: '+79999999999',
    status,
    seating_time: at(day, start),
    end_time: at(day, end)
  }
}

function eventsForTable(day, dayIndex, tableIndex, capacity, zone) {
  const orders = []
  const reservations = []
  const shift = (dayIndex + tableIndex) % 5

  if (tableIndex % 2 === 0) {
    orders.push(order(day, dayIndex, tableIndex, 0, 'New', `${12 + (shift % 2)}:00`, `${13 + (shift % 2)}:20`))
  }

  if (tableIndex % 3 === 0) {
    orders.push(order(day, dayIndex, tableIndex, 1, 'Bill', '13:10', '14:05'))
  }

  if (tableIndex % 4 === 0) {
    reservations.push(reservation(day, dayIndex, tableIndex, 0, 'Новая', '14:10', '15:40', tableIndex, Math.min(capacity, 4)))
  }

  if (tableIndex % 5 === 0) {
    reservations.push(reservation(day, dayIndex, tableIndex, 1, 'Заявка', '15:00', '16:10', tableIndex + 2, Math.min(capacity, 6)))
  }

  if (tableIndex % 6 === 0) {
    orders.push(order(day, dayIndex, tableIndex, 2, 'Closed', '16:15', '17:30'))
  }

  if (tableIndex % 7 === 0) {
    reservations.push(reservation(day, dayIndex, tableIndex, 2, 'Живая очередь', '17:05', '18:15', tableIndex + 5, Math.min(capacity, 3)))
  }

  if (tableIndex % 8 === 0) {
    reservations.push(reservation(day, dayIndex, tableIndex, 3, 'Открыт', '18:00', '19:20', tableIndex + 7, Math.min(capacity, 4)))
  }

  if (tableIndex % 9 === 0) {
    reservations.push(reservation(day, dayIndex, tableIndex, 4, 'Закрыт', '19:15', '20:20', tableIndex + 1, Math.min(capacity, 2)))
  }

  if (zone === 'Банкетный зал') {
    orders.push(order(day, dayIndex, tableIndex, 3, 'Banquet', '18:30', '22:20'))
  }

  if (tableIndex === 8 || tableIndex === 14 || tableIndex === 19) {
    reservations.push(reservation(day, dayIndex, tableIndex, 5, 'Новая', '13:05', '13:35', tableIndex + 3, 2))
    orders.push(order(day, dayIndex, tableIndex, 4, 'New', '13:15', '14:10'))
    reservations.push(reservation(day, dayIndex, tableIndex, 6, 'Заявка', '13:45', '14:35', tableIndex + 4, 3))
  }

  return { orders, reservations }
}

function makeTables(day, dayIndex) {
  return tablesTemplate.map(([number, capacity, zone], tableIndex) => {
    const events = eventsForTable(day, dayIndex, tableIndex, capacity, zone)

    return {
      id: `table-${number}-${zone.replaceAll(' ', '-')}`,
      capacity,
      number,
      zone,
      orders: events.orders,
      reservations: events.reservations
    }
  })
}

export const bookingData = {
  available_days: days,
  current_day: days[0],
  restaurant: {
    id: 11100,
    timezone: 'Asia/Vladivostok',
    restaurant_name: 'Супра',
    opening_time: '11:00',
    closing_time: '23:40'
  },
  tablesByDay: Object.fromEntries(days.map((day, index) => [day, makeTables(day, index)]))
}

export const bookingResponse = {
  available_days: bookingData.available_days,
  current_day: bookingData.current_day,
  restaurant: bookingData.restaurant,
  tables: bookingData.tablesByDay[bookingData.current_day]
}

export { zones }
