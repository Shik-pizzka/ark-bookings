import test from 'node:test'
import assert from 'node:assert/strict'
import { buildLayout, hasVisualOverlap } from '../src/domain/layout.js'

test('buildLayout separates overlapping events by lanes', () => {
  const layout = buildLayout([
    { id: '1', start: 720, end: 780 },
    { id: '2', start: 750, end: 810 },
    { id: '3', start: 815, end: 850 }
  ], 660, 1420, 2)

  assert.equal(layout.laneCount, 2)
  assert.equal(hasVisualOverlap(layout.items), false)
})

test('buildLayout accounts for short visible cards', () => {
  const layout = buildLayout([
    { id: '1', start: 720, end: 730 },
    { id: '2', start: 735, end: 745 },
    { id: '3', start: 750, end: 760 }
  ], 660, 1420, 2)

  assert.equal(hasVisualOverlap(layout.items), false)
})

test('buildLayout expands table width when lanes grow', () => {
  const layout = buildLayout([
    { id: '1', start: 720, end: 800 },
    { id: '2', start: 725, end: 805 },
    { id: '3', start: 730, end: 810 }
  ], 660, 1420, 2)

  assert.ok(layout.tableWidth >= 246)
})
