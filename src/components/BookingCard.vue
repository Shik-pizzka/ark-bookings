<script setup>
import { computed } from 'vue'
import { formatClock } from '../domain/time.js'
import { statusClass, statusLabels } from '../domain/status.js'

const props = defineProps({
  event: { type: Object, required: true },
  hidden: { type: Boolean, required: true }
})

const cardClass = computed(() => ['booking-card', statusClass(props.event.status)])
const period = computed(() => `${formatClock(props.event.start)}–${formatClock(props.event.end)}`)
const guest = computed(() => props.hidden && props.event.guest ? '••••••' : props.event.guest)
const phone = computed(() => props.hidden && props.event.phone ? '+7••••••••••' : props.event.phone)
</script>

<template>
  <article
    :class="cardClass"
    :style="{
      top: `${event.top}px`,
      left: `${event.left}px`,
      width: `${event.width}px`,
      height: `${event.height}px`
    }"
    tabindex="0"
    @click.stop
  >
    <div class="card-title">{{ event.title }}</div>
    <div class="card-status">{{ statusLabels[event.status] || event.status }}</div>
    <div v-if="guest" class="card-line">{{ guest }}<template v-if="event.people">, {{ event.people }} чел.</template></div>
    <div class="card-line">{{ period }}</div>

    <div class="card-popover">
      <strong>{{ event.title }}</strong>
      <span>Стол {{ event.tableNumber }} · {{ event.zone }}</span>
      <span>Статус: {{ statusLabels[event.status] || event.status }}</span>
      <span v-if="guest">Гость: {{ guest }}</span>
      <span v-if="phone">Телефон: {{ phone }}</span>
      <span>Время: {{ period }}</span>
    </div>
  </article>
</template>
