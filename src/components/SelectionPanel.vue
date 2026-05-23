<script setup>
import { computed } from 'vue'
import { formatClock } from '../domain/time.js'

const props = defineProps({
  selectedTables: { type: Set, required: true },
  start: { type: [Number, null], required: false, default: null },
  end: { type: [Number, null], required: false, default: null },
  hasSelection: { type: Boolean, required: true }
})

const emit = defineEmits(['clear', 'create'])

const text = computed(() => {
  const tables = props.selectedTables.size ? `${props.selectedTables.size} стол.` : 'столы не выбраны'
  const time = props.start !== null && props.end !== null
    ? `${formatClock(props.start)}–${formatClock(props.end)}`
    : 'выберите время'

  return `${tables}, ${time}`
})
</script>

<template>
  <aside class="selection-panel">
    <div>
      <span>Создание брони</span>
      <strong>{{ text }}</strong>
    </div>
    <button type="button" class="ghost-button" @click="emit('clear')">Сбросить</button>
    <button type="button" class="primary-button" :disabled="!hasSelection" @click="emit('create')">Создать</button>
  </aside>
</template>
