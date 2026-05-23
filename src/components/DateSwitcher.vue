<script setup>
defineProps({
  days: { type: Array, required: true },
  selectedDay: { type: String, required: true }
})

const emit = defineEmits(['change'])

function formatDay(day) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    weekday: 'short'
  }).format(new Date(`${day}T12:00:00`))
}
</script>

<template>
  <section class="toolbar-block">
    <span class="toolbar-title">Дата</span>
    <div class="button-row">
      <button
        v-for="day in days"
        :key="day"
        type="button"
        class="chip"
        :class="{ active: day === selectedDay }"
        @click="emit('change', day)"
      >
        {{ formatDay(day) }}
      </button>
    </div>
  </section>
</template>
