import { onBeforeUnmount, ref } from 'vue'
import { getRestaurantTime } from '../domain/time.js'

export function useRestaurantClock(timezone) {
  const value = ref(getRestaurantTime(timezone))
  const timer = window.setInterval(() => {
    value.value = getRestaurantTime(timezone)
  }, 1000)

  onBeforeUnmount(() => window.clearInterval(timer))

  return value
}
