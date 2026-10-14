import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/authContext'
import { getApiError } from '../services/api'

export default function AuthPage({ register = false }) {
  const { login, register: createAccount } = useAuth()
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
      if (register) await createAccount(values)
      else await login({ email: values.email, password: values.password })
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="auth-page">
    <Link className="brand auth-brand" to="/login"><span className="brand-mark">A</span> agri<span>trade</span></Link>
    <div className="auth-layout">
      <section className="auth-panel">
        <p className="eyebrow">{register ? 'YOUR NEXT HARVEST STARTS HERE' : 'WELCOME TO AGRITRADE'}</p>
        <h1>{register ? 'Join AgriTrade.' : 'Good to see you.'}</h1>
        <p className="auth-subtitle">{register ? 'Create your account to connect with growers, buyers, and delivery partners.' : 'Login to find your place in a better-connected food marketplace.'}</p>
        <form onSubmit={submit}>
          {register && <label>Your name<input required maxLength="100" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} autoComplete="name" /></label>}
          <label>Email address<input required type="email" maxLength="190" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} autoComplete="email" /></label>
          <label>Password<input required type="password" minLength={register ? 8 : undefined} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} autoComplete={register ? 'new-password' : 'current-password'} /></label>
          {register && <label>How will you use AgriTrade?<select value={values.role} onChange={(event) => setValues({ ...values, role: event.target.value })}><option value="FARMER">Produce</option><option value="BUYER">Buyer</option><option value="LOGISTICS">Logistics</option></select></label>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark submit-button" disabled={submitting}>{submitting ? 'Please wait…' : register ? 'Create my account' : 'Login'} <span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-switch">{register ? 'Already part of AgriTrade?' : 'New to AgriTrade?'} <Link to={register ? '/login' : '/register'}>{register ? 'Login' : 'Join AgriTrade'}</Link></p>
      </section>
      <aside className="auth-showcase" aria-label="AgriTrade marketplace">
        <div className="auth-showcase-copy"><span className="showcase-pill">GROWN TOGETHER</span><h2>A fairer path from farm to market.</h2><p>Meet your next customer, source fresh produce, and keep every delivery moving.</p></div>
        <div className="auth-crop-card"><span className="auth-crop-icon" aria-hidden="true">🌾</span><div><strong>One marketplace. Many possibilities.</strong><span>Grow · Trade · Deliver</span></div><span className="auth-crop-arrow" aria-hidden="true">↗</span></div>
      </aside>
    </div>
  </main>
}
