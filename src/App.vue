<script setup>
import { computed, ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import BookingGrid from './components/BookingGrid.vue'
import DateSwitcher from './components/DateSwitcher.vue'
import LegendBar from './components/LegendBar.vue'
import SearchPanel from './components/SearchPanel.vue'
import SelectionPanel from './components/SelectionPanel.vue'
import ZoneFilter from './components/ZoneFilter.vue'
import { getBookingData } from './api/bookingRepository.js'
import { useRestaurantClock } from './composables/useRestaurantClock.js'
import { useSelection } from './composables/useSelection.js'
import { buildLayout } from './domain/layout.js'
import { mapEventsByTable } from './domain/mapper.js'
import { makeTimeMarks, parseClock } from './domain/time.js'

const initialData = getBookingData()
const selectedDay = ref(initialData.current_day)
const hidden = ref(false)
const theme = ref('dark')
const search = ref('')
const selectedZones = ref(new Set(['1 этаж', '2 этаж', 'Банкетный зал']))
const selection = useSelection()
const restaurantTime = useRestaurantClock(initialData.restaurant.timezone)
const minuteHeight = 2.8

const data = computed(() => getBookingData(selectedDay.value))
const restaurant = computed(() => data.value.restaurant)
const opening = computed(() => parseClock(restaurant.value.opening_time))
const closing = computed(() => parseClock(restaurant.value.closing_time))
const timeMarks = computed(() => makeTimeMarks(restaurant.value.opening_time, restaurant.value.closing_time))
const zones = computed(() => [...new Set(data.value.tables.map((table) => table.zone))])

const visibleTables = computed(() => {
  const query = search.value.trim().toLowerCase()
  const eventsByTable = mapEventsByTable(data.value.tables)

  return data.value.tables.filter((table) => {
    if (!selectedZones.value.has(table.zone)) return false
    if (!query) return true

    const tableText = `${table.number} ${table.zone}`.toLowerCase()
    const eventText = eventsByTable[table.id]
      .map((event) => `${event.status} ${event.guest} ${event.phone} ${event.title}`)
      .join(' ')
      .toLowerCase()

    return `${tableText} ${eventText}`.includes(query)
  })
})

const layouts = computed(() => {
  const eventsByTable = mapEventsByTable(visibleTables.value)

  return Object.fromEntries(
    visibleTables.value.map((table) => [
      table.id,
      buildLayout(eventsByTable[table.id], opening.value, closing.value, minuteHeight)
    ])
  )
})

function toggleZone(zone) {
  const next = new Set(selectedZones.value)
  next.has(zone) ? next.delete(zone) : next.add(zone)
  selectedZones.value = next.size ? next : new Set([zone])
}

function changeDay(day) {
  selectedDay.value = day
  selection.clear()
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <main class="page" :data-theme="theme">
    <AppHeader
      :restaurant="restaurant"
      :time="restaurantTime"
      :hidden="hidden"
      :theme="theme"
      @toggle-hidden="hidden = !hidden"
      @toggle-theme="toggleTheme"
    />

    <div class="toolbar">
      <DateSwitcher :days="data.available_days" :selected-day="selectedDay" @change="changeDay" />
      <ZoneFilter :zones="zones" :selected-zones="selectedZones" @toggle="toggleZone" />
      <SearchPanel v-model="search" />
    </div>

    <LegendBar />

    <BookingGrid
      :tables="visibleTables"
      :layouts="layouts"
      :time-marks="timeMarks"
      :opening="opening"
      :closing="closing"
      :minute-height="minuteHeight"
      :hidden="hidden"
      :selected-tables="selection.selectedTables.value"
      :selected-start="selection.start.value"
      :selected-end="selection.end.value"
      @toggle-table="selection.toggleTable"
      @select-time="selection.setRange"
    />

    <SelectionPanel
      :selected-tables="selection.selectedTables.value"
      :start="selection.start.value"
      :end="selection.end.value"
      :has-selection="selection.hasSelection.value"
      @clear="selection.clear"
      @create="selection.create"
    />
  </main>
</template>
