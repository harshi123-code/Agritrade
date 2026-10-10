import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
