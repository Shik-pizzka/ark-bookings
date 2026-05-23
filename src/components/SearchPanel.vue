<script setup>
defineProps({
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="search-box">
    <span>Поиск</span>
    <input
      :value="modelValue"
      type="search"
      placeholder="Гость, стол, статус"
      @input="emit('update:modelValue', $event.target.value)"
    >
  </label>
</template>
