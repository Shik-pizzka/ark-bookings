<script setup>
import { computed } from 'vue'
import BookingCard from './BookingCard.vue'
import { formatClock } from '../domain/time.js'

const props = defineProps({
  tables: { type: Array, required: true },
  layouts: { type: Object, required: true },
  timeMarks: { type: Array, required: true },
  opening: { type: Number, required: true },
  closing: { type: Number, required: true },
  minuteHeight: { type: Number, required: true },
  hidden: { type: Boolean, required: true },
  selectedTables: { type: Set, required: true },
  selectedStart: { type: [Number, null], required: false, default: null },
  selectedEnd: { type: [Number, null], required: false, default: null }
})

const emit = defineEmits(['toggle-table', 'select-time'])

const totalHeight = computed(() => (props.closing - props.opening) * props.minuteHeight)
const tableTemplate = computed(() => props.tables.map((table) => `${layoutFor(table).tableWidth}px`).join(' '))
const selectionTop = computed(() => {
  if (props.selectedStart === null || props.selectedEnd === null) return 0
  return (props.selectedStart - props.opening) * props.minuteHeight
})
const selectionHeight = computed(() => {
  if (props.selectedStart === null || props.selectedEnd === null) return 0
  return Math.max(0, (props.selectedEnd - props.selectedStart) * props.minuteHeight)
})

function layoutFor(table) {
  return props.layouts[table.id] || { tableWidth: 154, items: [], laneCount: 1 }
}

function onColumnClick(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const offset = event.clientY - rect.top
  const raw = props.opening + Math.round(offset / props.minuteHeight / 30) * 30
  const value = Math.min(props.closing, Math.max(props.opening, raw))
  emit('select-time', value)
}
</script>

<template>
  <div class="booking-grid-shell">
    <div class="booking-grid" :style="{ '--time-height': `${totalHeight}px`, '--table-template': tableTemplate }">
      <div class="corner-cell">Время</div>

      <div class="table-header-row">
        <button
          v-for="table in tables"
          :key="table.id"
          type="button"
          class="table-head"
          :class="{ selected: selectedTables.has(table.id) }"
          :style="{ width: `${layoutFor(table).tableWidth}px` }"
          @click="emit('toggle-table', table.id)"
        >
          <strong>#{{ table.number }}</strong>
          <span>{{ table.capacity }} чел · {{ table.zone }}</span>
        </button>
      </div>

      <div class="time-column" :style="{ height: `${totalHeight}px` }">
        <button
          v-for="mark in timeMarks"
          :key="mark.value"
          type="button"
          class="time-mark"
          :style="{ top: `${(mark.value - opening) * minuteHeight}px` }"
          @click="emit('select-time', mark.value)"
        >
          {{ mark.label }}
        </button>
      </div>

      <div class="tables-body" :style="{ height: `${totalHeight}px` }">
        <section
          v-for="table in tables"
          :key="table.id"
          class="table-column"
          :class="{ selected: selectedTables.has(table.id) }"
          :style="{ width: `${layoutFor(table).tableWidth}px`, height: `${totalHeight}px` }"
          @click="onColumnClick"
        >
          <div
            v-if="selectedTables.has(table.id) && selectionHeight > 0"
            class="selection-range"
            :style="{ top: `${selectionTop}px`, height: `${selectionHeight}px` }"
          />

          <BookingCard
            v-for="event in layoutFor(table).items"
            :key="event.id"
            :event="event"
            :hidden="hidden"
          />
        </section>
      </div>
    </div>
  </div>

  <p class="grid-hint">Клик по заголовку выбирает стол. Два клика по сетке задают начало и конец будущей брони.</p>
</template>
