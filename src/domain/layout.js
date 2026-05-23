const MIN_VISIBLE_MINUTES = 42
const LANE_WIDTH = 82
const BASE_TABLE_WIDTH = 154
const CARD_GAP = 4

export function buildLayout(events, opening, closing, minuteHeight = 2.6) {
  const sortedEvents = [...events]
    .map((event) => {
      const start = clamp(event.start, opening, closing)
      const rawEnd = clamp(event.end, opening, closing)
      const end = Math.max(rawEnd, start + 1)
      const displayEnd = Math.min(closing, start + Math.max(end - start, MIN_VISIBLE_MINUTES))

      return { ...event, start, end, displayEnd }
    })
    .filter((event) => event.start < closing && event.end > opening)
    .sort((a, b) => a.start - b.start || b.end - a.end)

  const lanes = []
  const items = []

  for (const event of sortedEvents) {
    let laneIndex = lanes.findIndex((laneEnd) => laneEnd <= event.start)

    if (laneIndex === -1) {
      laneIndex = lanes.length
      lanes.push(event.displayEnd)
    } else {
      lanes[laneIndex] = event.displayEnd
    }

    items.push({ ...event, lane: laneIndex })
  }

  const laneCount = Math.max(1, lanes.length)
  const tableWidth = Math.max(BASE_TABLE_WIDTH, laneCount * LANE_WIDTH + CARD_GAP * 2)
  const laneWidth = (tableWidth - CARD_GAP * 2) / laneCount

  return {
    laneCount,
    tableWidth,
    items: items.map((event) => ({
      ...event,
      top: (event.start - opening) * minuteHeight,
      height: Math.max((event.displayEnd - event.start) * minuteHeight - CARD_GAP, 18),
      left: CARD_GAP + event.lane * laneWidth,
      width: laneWidth - CARD_GAP
    }))
  }
}

export function hasVisualOverlap(layoutItems) {
  for (let i = 0; i < layoutItems.length; i += 1) {
    for (let j = i + 1; j < layoutItems.length; j += 1) {
      const first = layoutItems[i]
      const second = layoutItems[j]
      const xOverlap = first.left < second.left + second.width && second.left < first.left + first.width
      const yOverlap = first.top < second.top + second.height && second.top < first.top + first.height

      if (xOverlap && yOverlap) {
        return true
      }
    }
  }

  return false
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}
