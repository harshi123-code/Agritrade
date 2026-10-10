import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import './App.css'
import App from './App.jsx'
import { AuthProvider } from './components/AuthProvider.jsx'
import { useAuth } from './components/authContext.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import MarketDeskPage from './pages/MarketDeskPage.jsx'
import AgriAiPage from './pages/AgriAiPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'

function EntryRoute() {
  const { user } = useAuth()
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<EntryRoute />} />
          <Route path="/marketplace" element={<App />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage register />} />
          <Route path="/market-desk" element={<MarketDeskPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/agri-ai" element={<AgriAiPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
