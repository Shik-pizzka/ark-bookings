export const statusLabels = {
  New: 'Новый',
  Bill: 'Счёт',
  Closed: 'Закрыт',
  Banquet: 'Банкет',
  'Живая очередь': 'Живая очередь',
  Новая: 'Ожидает',
  Заявка: 'Заявка',
  Открыт: 'Открыт',
  Закрыт: 'Отменён'
}

export function statusClass(status) {
  return `status-${String(status).toLowerCase().replaceAll(' ', '-').replaceAll('ё', 'е')}`
}
