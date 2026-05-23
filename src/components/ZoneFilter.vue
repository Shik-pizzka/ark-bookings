<script setup>
defineProps({
  zones: { type: Array, required: true },
  selectedZones: { type: Set, required: true }
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <section class="toolbar-block">
    <span class="toolbar-title">Отображаемые зоны</span>
    <div class="button-row">
      <button
        v-for="zone in zones"
        :key="zone"
        type="button"
        class="chip"
        :class="{ active: selectedZones.has(zone) }"
        @click="emit('toggle', zone)"
      >
        {{ zone }}
      </button>
    </div>
  </section>
</template>
