export function filterCropListings(crops, filters = {}) {
  const { query = '', crop = '', location = '' } = typeof filters === 'string' ? { query: filters } : filters
  const normalizedQuery = query.trim().toLowerCase()
  const normalizedCrop = crop.trim().toLowerCase()
  const normalizedLocation = location.trim().toLowerCase()
  return crops.filter((listing) => {
    const cropName = listing.cropName.toLowerCase()
    const cropLocation = listing.location.toLowerCase()
    const matchesQuery = !normalizedQuery || `${cropName} ${cropLocation}`.includes(normalizedQuery)
    const matchesCrop = !normalizedCrop || cropName.includes(normalizedCrop)
    const matchesLocation = !normalizedLocation || cropLocation.includes(normalizedLocation)
    return matchesQuery && matchesCrop && matchesLocation
  })
}