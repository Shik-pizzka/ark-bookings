import test from 'node:test'
import assert from 'node:assert/strict'
import { getBookingData } from '../src/api/bookingRepository.js'

test('getBookingData returns api-shaped response', () => {
  const data = getBookingData()

  assert.ok(Array.isArray(data.available_days))
  assert.equal(typeof data.restaurant.restaurant_name, 'string')
  assert.ok(Array.isArray(data.tables))
  assert.ok(data.tables.length > 20)
})

test('getBookingData switches days', () => {
  const data = getBookingData('2025-04-06')

  assert.equal(data.selected_day, '2025-04-06')
})
