export function filterMarketRows(rows, cropFilter = '', locationFilter = '') {
  const cropQuery = cropFilter.trim().toLowerCase()
  const locationQuery = locationFilter.trim().toLowerCase()

  return rows.filter((row) => {
    const crop = String(row.crop ?? row.cropName ?? '').toLowerCase()
    const location = String(row.location ?? '').toLowerCase()
    const market = String(row.market ?? row.marketName ?? '').toLowerCase()
    return crop.includes(cropQuery) && `${location} ${market}`.includes(locationQuery)
  })
}