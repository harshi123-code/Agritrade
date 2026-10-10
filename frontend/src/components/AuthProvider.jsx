import { useMemo, useState } from 'react'
import api from '../services/api'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('agritrade-user') || 'null') } catch { return null }
  })

  async function authenticate(path, credentials) {
    const { data } = await api.post(`/auth/${path}`, credentials)
    const profile = { userId: data.userId, name: data.name, email: data.email, role: data.role }
    sessionStorage.setItem('agritrade-token', data.token)
    sessionStorage.setItem('agritrade-user', JSON.stringify(profile))
    setUser(profile)
    return profile
  }

  function logout() {
    sessionStorage.removeItem('agritrade-token')
    sessionStorage.removeItem('agritrade-user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login: (credentials) => authenticate('login', credentials), register: (details) => authenticate('register', details), logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
