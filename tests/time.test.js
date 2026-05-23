import test from 'node:test'
import assert from 'node:assert/strict'
import { formatClock, makeTimeMarks, parseClock } from '../src/domain/time.js'

test('parseClock converts HH:mm to minutes', () => {
  assert.equal(parseClock('11:30'), 690)
})

test('formatClock converts minutes to HH:mm', () => {
  assert.equal(formatClock(855), '14:15')
})

test('makeTimeMarks builds marks by step', () => {
  const marks = makeTimeMarks('11:00', '12:00', 30)
  assert.deepEqual(marks, [
    { value: 660, label: '11:00' },
    { value: 690, label: '11:30' },
    { value: 720, label: '12:00' }
  ])
})
