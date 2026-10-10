import { describe, expect, it } from 'vitest'
import { filterCropListings } from './marketplace'

const crops = [
  { cropName: 'Basmati rice', location: 'Karnal, Haryana' },
  { cropName: 'Turmeric', location: 'Nizamabad, Telangana' },
]

describe('filterCropListings', () => {
  it('matches crop names without case sensitivity', () => {
    expect(filterCropListings(crops, 'RICE')).toEqual([crops[0]])
  })

  it('matches farm locations and trims the search', () => {
    expect(filterCropListings(crops, '  telangana ')).toEqual([crops[1]])
  })

  it('applies crop and location filters independently', () => {
    const listings = [
      ...crops,
      { cropName: 'Rice', location: 'Nizamabad, Telangana' },
      { cropName: 'Rice', location: 'Karnal, Haryana' },
    ]
    expect(filterCropListings(listings, { crop: 'rice', location: 'nizamabad' })).toEqual([listings[2]])
  })

  it('returns all listings for an empty search', () => {
    expect(filterCropListings(crops, '')).toEqual(crops)
  })
})