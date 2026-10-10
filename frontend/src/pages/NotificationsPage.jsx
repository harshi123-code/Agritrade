import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function NotificationsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  async function loadNotifications() {
    try {
      const { data } = await api.get('/notifications')
      setItems(data)
    } catch {
      setError('Unable to load your notifications right now.')
    }
  }

  useEffect(() => { loadNotifications() }, [])

  async function markRead(id) {
    try {
      await api.put(`/notifications/${id}/read`)
      await loadNotifications()
    } catch {
      setError('Unable to update this notification.')
    }
  }

  return <main className="dashboard-page"><header className="dashboard-nav"><Link className="brand" to="/marketplace"><span className="brand-mark">A</span> agri<span>trade</span></Link><nav><Link to="/marketplace">Marketplace</Link><Link to="/market-desk">Market Desk</Link><Link to="/dashboard">Dashboard</Link></nav><Link className="top-link" to="/agri-ai">Ask AgriAI</Link></header><section className="dashboard-intro"><div><p className="eyebrow">ACCOUNT UPDATES <span>•</span> INBOX</p><h1>Notifications</h1><p>Order and delivery updates for your account.</p></div></section>{error && <p className="notice" role="alert">{error}</p>}<section className="notification-list">{items.length ? items.map((item) => <article className={`notification-row ${item.read ? 'is-read' : 'is-unread'}`} key={item.id}><span className="notification-mark"/><div><span className="notification-type">{item.type.replaceAll('_', ' ')}</span><p>{item.message}</p><time>{new Date(item.createdAt).toLocaleString()}</time></div>{!item.read && <button onClick={() => markRead(item.id)}>Mark read</button>}</article>) : <p className="orders-empty">You are all caught up.</p>}</section><footer className="dashboard-footer"><Link to="/dashboard">← Return to dashboard</Link><span>AgriTrade · Notifications</span></footer></main>
}
