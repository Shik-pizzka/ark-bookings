<script setup>
defineProps({
  restaurant: { type: Object, required: true },
  time: { type: String, required: true },
  hidden: { type: Boolean, required: true },
  theme: { type: String, required: true }
})

const emit = defineEmits(['toggle-hidden', 'toggle-theme'])
</script>

<template>
  <header class="app-header">
    <div>
      <div class="eyebrow">ARK TABLES | {{ restaurant.restaurant_name }}</div>
      <h1>Бронирования</h1>
      <p>Просмотр занятости столов, очереди и бронирований по рабочему дню ресторана.</p>
    </div>

    <div class="header-actions">
      <div class="clock-card">
        <span>Время ресторана</span>
        <strong>{{ time }}</strong>
      </div>
      <button type="button" class="ghost-button" @click="emit('toggle-hidden')">
        {{ hidden ? 'Показать данные' : 'Скрыть данные' }}
      </button>
      <button type="button" class="ghost-button" @click="emit('toggle-theme')">
        {{ theme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}
      </button>
    </div>
  </header>
</template>
