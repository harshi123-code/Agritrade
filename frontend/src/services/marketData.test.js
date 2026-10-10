import { describe, expect, it } from 'vitest'
import { filterMarketRows } from './marketData'

const rows = [
  { crop: 'Turmeric', market: 'Nizamabad Market', location: 'Nizamabad' },
  { crop: 'Rice', market: 'Hyderabad Market', location: 'Hyderabad' },
  { cropName: 'Rice', marketName: 'Nizamabad Market', location: 'Nizamabad' },
]

describe('filterMarketRows', () => {
  it('filters by crop and location independently', () => {
    expect(filterMarketRows(rows, 'rice', 'nizamabad')).toEqual([rows[2]])
  })

  it('allows a location filter to match the market name', () => {
    expect(filterMarketRows(rows, '', 'hyderabad market')).toEqual([rows[1]])
  })

  it('returns all rows when both filters are empty', () => {
    expect(filterMarketRows(rows)).toEqual(rows)
  })
})