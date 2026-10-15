import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/authContext'
import { getApiError } from '../services/api'

export default function AuthPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ name: '', email: '', password: '', role: 'FARMER' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await register(values)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="auth-page">
    <Link className="brand auth-brand" to="/marketplace"><span className="brand-mark">A</span> agri<span>trade</span></Link>
    <div className="auth-layout">
      <section className="auth-panel">
        <p className="eyebrow">YOUR NEXT HARVEST STARTS HERE</p>
        <h1>Join AgriTrade.</h1>
        <p className="auth-subtitle">Create your account to connect with growers, buyers, and delivery partners.</p>
        <form onSubmit={submit}>
          <label>Your name<input required maxLength="100" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} autoComplete="name" /></label>
          <label>Email address<input required type="email" maxLength="190" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} autoComplete="email" /></label>
          <label>Password<input required type="password" minLength={8} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} autoComplete="new-password" /></label>
          <label>How will you use AgriTrade?<select value={values.role} onChange={(event) => setValues({ ...values, role: event.target.value })}><option value="FARMER">Produce</option><option value="BUYER">Buyer</option><option value="LOGISTICS">Logistics</option></select></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark submit-button" disabled={submitting}>{submitting ? 'Please wait…' : 'Join AgriTrade'} <span aria-hidden="true">→</span></button>
        </form>
      </section>
      <aside className="auth-showcase" aria-label="AgriTrade marketplace">
        <div className="auth-showcase-copy"><span className="showcase-pill">GROWN TOGETHER</span><h2>A fairer path from farm to market.</h2><p>Meet your next customer, source fresh produce, and keep every delivery moving.</p></div>
        <div className="auth-crop-card"><span className="auth-crop-icon" aria-hidden="true">🌾</span><div><strong>One marketplace. Many possibilities.</strong><span>Grow · Trade · Deliver</span></div><span className="auth-crop-arrow" aria-hidden="true">↗</span></div>
      </aside>
    </div>
  </main>
}
