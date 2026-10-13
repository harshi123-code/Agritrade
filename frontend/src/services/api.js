import axios from 'axios'

const defaultApiUrl = import.meta.env.DEV
  ? '/api'
  : 'https://agritrade-15.onrender.com/api'
const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
const apiBaseUrl = configuredApiUrl
  ? configuredApiUrl.endsWith('/api')
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : defaultApiUrl

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('agritrade-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function getApiError(error) {
  return error.response?.data?.detail || error.response?.data?.message || error.message || 'Something went wrong.'
}

export default api
