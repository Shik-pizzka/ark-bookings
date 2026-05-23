import { computed, ref } from 'vue'
import { formatClock } from '../domain/time.js'

export function useSelection() {
  const selectedTables = ref(new Set())
  const start = ref(null)
  const end = ref(null)

  const hasSelection = computed(() => selectedTables.value.size > 0 && start.value !== null && end.value !== null)

  function toggleTable(tableId) {
    const next = new Set(selectedTables.value)
    next.has(tableId) ? next.delete(tableId) : next.add(tableId)
    selectedTables.value = next
  }

  function setRange(value) {
    if (start.value === null || end.value !== null) {
      start.value = value
      end.value = null
      return
    }

    if (value < start.value) {
      end.value = start.value
      start.value = value
      return
    }

    end.value = value
  }

  function clear() {
    selectedTables.value = new Set()
    start.value = null
    end.value = null
  }

  function create() {
    if (!hasSelection.value) return

    console.log({
      tableIds: [...selectedTables.value],
      start: formatClock(start.value),
      end: formatClock(end.value)
    })
  }

  return {
    selectedTables,
    start,
    end,
    hasSelection,
    toggleTable,
    setRange,
    clear,
    create
  }
}
