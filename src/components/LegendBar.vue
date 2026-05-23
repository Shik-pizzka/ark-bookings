<script setup>
const items = [
  ['New', 'Новый заказ'],
  ['Bill', 'Счёт'],
  ['Closed', 'Закрытый заказ'],
  ['Banquet', 'Банкет'],
  ['Живая очередь', 'Живая очередь'],
  ['Новая', 'Новая бронь'],
  ['Заявка', 'Заявка'],
  ['Открыт', 'Гость в ресторане'],
  ['Закрыт', 'Отменено']
]

function className(status) {
  return `legend-dot status-${status.toLowerCase().replaceAll(' ', '-').replaceAll('ё', 'е')}`
}
</script>

<template>
  <div class="legend-bar">
    <span v-for="[status, label] in items" :key="status" class="legend-item">
      <i :class="className(status)" />
      {{ label }}
    </span>
  </div>
</template>
