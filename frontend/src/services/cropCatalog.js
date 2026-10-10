const commonsFile = (file) => `https://commons.wikimedia.org/wiki/${file}`

const image = (url, file) => ({ imageUrl: url, imageSource: commonsFile(file) })

export const cropCatalog = {
  turmeric: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/5/5b/Curcuma_longa_roots.jpg', 'File:Curcuma_longa_roots.jpg'),
    icon: '🌿', institute: 'ICAR-Indian Institute of Spices Research', instituteUrl: 'https://spices.res.in/',
  },
  rice: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/e/ef/Green_rice_sheaves_planted_in_a_paddy_field_with_long_shadows_at_golden_hour_in_Don_Det_Laos.jpg', 'File:Green_rice_sheaves_planted_in_a_paddy_field_with_long_shadows_at_golden_hour_in_Don_Det_Laos.jpg'),
    icon: '🌾', institute: 'ICAR-Indian Institute of Rice Research', instituteUrl: 'https://www.icar-iirr.org/',
  },
  cotton: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/c/c5/Cotton_boll_nearly_ready_for_harvest.jpg', 'File:Cotton_boll_nearly_ready_for_harvest.jpg'),
    icon: '☁️', institute: 'ICAR-Central Institute for Cotton Research', instituteUrl: 'https://cicr.org.in/',
  },
  maize: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/b/bd/Corn_field_in_Mexico.jpg', 'File:Corn_field_in_Mexico.jpg'),
    icon: '🌽', institute: 'ICAR-Indian Institute of Maize Research', instituteUrl: 'https://iimr.icar.gov.in/',
  },
  chilli: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/7/7d/Chilli_pepper_harvesting.jpg', 'File:Chilli_pepper_harvesting.jpg'),
    icon: '🌶️', institute: 'ICAR-Indian Institute of Spices Research', instituteUrl: 'https://spices.res.in/',
  },
  'red gram': {
    ...image('https://upload.wikimedia.org/wikipedia/commons/6/6f/Cajanus_cajan_Steve_Hurst_1.jpg', 'File:Cajanus_cajan_Steve_Hurst_1.jpg'),
    icon: '🫘', institute: 'ICAR-Indian Institute of Pulses Research', instituteUrl: 'https://iipr.icar.gov.in/',
  },
  tomato: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/c/c3/Organic_home-grown_tomatoes_-_unripe_to_ripe.jpg', 'File:Organic_home-grown_tomatoes_-_unripe_to_ripe.jpg'),
    icon: '🍅', institute: 'ICAR-Indian Institute of Vegetable Research', instituteUrl: 'https://iivr.icar.gov.in/',
  },
  onion: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/5/53/Onion_harvest_-_geograph.org.uk_-_548693.jpg', 'File:Onion_harvest_-_geograph.org.uk_-_548693.jpg'),
    icon: '🧅', institute: 'ICAR-Indian Institute of Vegetable Research', instituteUrl: 'https://iivr.icar.gov.in/',
  },
  groundnut: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/6/60/Groundnut_on_the_farm.jpg', 'File:Groundnut_on_the_farm.jpg'),
    icon: '🥜', institute: 'ICAR-Indian Institute of Oilseeds Research', instituteUrl: 'https://icar-iior.org.in/',
  },
  soybean: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/2/23/Soybean_%28PSF%29.png', 'File:Soybean_(PSF).png'),
    icon: '🫛', institute: 'ICAR-Indian Institute of Soybean Research', instituteUrl: 'https://iisr.icar.gov.in/',
  },
  potato: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/0/08/Potato_Field_-_geograph.org.uk_-_556030.jpg', 'File:Potato_Field_-_geograph.org.uk_-_556030.jpg'),
    icon: '🥔', institute: 'ICAR-Central Potato Research Institute', instituteUrl: 'https://cpri.icar.gov.in/',
  },
  wheat: {
    ...image('https://upload.wikimedia.org/wikipedia/commons/0/04/Sunset-over-the-wheat-field-featured.jpg', 'File:Sunset-over-the-wheat-field-featured.jpg'),
    icon: '🌾', institute: 'ICAR-Indian Institute of Wheat and Barley Research', instituteUrl: 'https://iiwbr.icar.gov.in/',
  },
}

export function getCropInfo(cropName = '') {
  const key = cropName.trim().toLowerCase()
  return cropCatalog[key] || {
    imageUrl: '',
    imageSource: '',
    icon: '🌱',
    institute: 'ICAR crop information',
    instituteUrl: 'https://icar.gov.in/',
  }
}