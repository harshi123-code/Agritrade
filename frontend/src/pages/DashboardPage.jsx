import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/authContext'
import api from '../services/api'

const dashboardCopy = {
  FARMER: { title: 'Farmer dashboard', intro: 'Your harvest, your marketplace.', actions: ['Add produce', 'My produce', 'My orders', 'AI recommendations'] },
  BUYER: { title: 'Buyer dashboard', intro: 'Find produce that fits your needs.', actions: ['Browse produce', 'My orders', 'Market Desk', 'Profile'] },
  LOGISTICS: { title: 'Logistics dashboard', intro: 'Keep every delivery moving.', actions: ['Assigned deliveries', 'Pickup routes', 'Delivery status', 'Profile'] },
  ADMIN: { title: 'Platform dashboard', intro: 'AgriTrade overview.', actions: ['Marketplace', 'Market Desk', 'User accounts', 'Platform status'] },
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [listingCount, setListingCount] = useState(null)
  const [orders, setOrders] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [readyOrders, setReadyOrders] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadError, setLoadError] = useState('')
  const content = dashboardCopy[user.role] || dashboardCopy.FARMER

  useEffect(() => {
    let ignore = false
    const orderRequest = user.role === 'LOGISTICS' ? api.get('/orders/ready-for-delivery') : api.get('/orders')
    const roleRequest = user.role === 'LOGISTICS' ? api.get('/deliveries') : api.get('/notifications/unread-count')
    Promise.all([api.get('/crops'), orderRequest, roleRequest]).then(([cropResponse, orderResponse, roleResponse]) => {
      if (!ignore) {
        setListingCount(cropResponse.data.length)
        if (user.role === 'LOGISTICS') {
          setReadyOrders(orderResponse.data)
          setDeliveries(roleResponse.data)
        } else {
          setOrders(orderResponse.data)
          setUnreadCount(roleResponse.data.count)
        }
      }
    }).catch(() => {
      if (!ignore) setLoadError('Marketplace data is temporarily unavailable.')
    })
    return () => { ignore = true }
  }, [user.role])

  async function refreshLogistics() {
    const [deliveriesResponse, readyResponse] = await Promise.all([api.get('/deliveries'), api.get('/orders/ready-for-delivery')])
    setDeliveries(deliveriesResponse.data)
    setReadyOrders(readyResponse.data)
  }

  async function assignDelivery(orderId) {
    try {
      await api.post(`/deliveries/orders/${orderId}/assign`)
      await refreshLogistics()
    } catch {
      setLoadError('Unable to assign this delivery. Refresh and try again.')
    }
  }

  async function advanceDelivery(delivery) {
    const statuses = ['ASSIGNED', 'PICKUP_PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED']
    const nextStatus = statuses[statuses.indexOf(delivery.status) + 1]
    if (!nextStatus) return
    try {
      await api.put(`/deliveries/${delivery.id}/status`, { status: nextStatus })
      await refreshLogistics()
    } catch {
      setLoadError('Unable to update the delivery status.')
    }
  }

  async function updateOrder(orderId, status) {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      const { data } = await api.get('/orders')
      setOrders(data)
    } catch {
      setLoadError('Unable to update this order. Refresh and try again.')
    }
  }

  return <main className="dashboard-page"><header className="dashboard-nav"><Link className="brand" to="/marketplace"><span className="brand-mark">A</span> agri<span>trade</span></Link><nav><Link to="/marketplace">Marketplace</Link><Link to="/market-desk">Market Desk</Link><Link to="/agri-ai">AgriAI</Link><Link to="/notifications">Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}</Link></nav><button className="button button-dark top-action" onClick={() => { logout(); navigate('/marketplace') }}>Log out</button></header>
    <section className="dashboard-intro"><div><p className="eyebrow">YOUR AGRITRADE WORKSPACE <span>•</span> {user.role}</p><h1>{content.title}</h1><p>{content.intro}</p></div><div className="dashboard-user"><span className="user-avatar">{user.name.slice(0, 1).toUpperCase()}</span><div><strong>{user.name}</strong><span>{user.email}</span></div></div></section>
    <section className="dashboard-stats"><article><span>MARKET LISTINGS</span><strong>{listingCount === null ? '…' : listingCount}</strong><small>{loadError || 'Current marketplace supply'}</small></article><article><span>{user.role === 'LOGISTICS' ? 'AVAILABLE PICKUPS' : 'ACTIVE ORDERS'}</span><strong>{user.role === 'LOGISTICS' ? readyOrders.length : orders.filter((order) => !['DELIVERED', 'REJECTED'].includes(order.status)).length}</strong><small>Orders that need attention</small></article><article><span>{user.role === 'LOGISTICS' ? 'ASSIGNED DELIVERIES' : 'UNREAD NOTIFICATIONS'}</span><strong>{user.role === 'LOGISTICS' ? deliveries.filter((delivery) => delivery.status !== 'DELIVERED').length : unreadCount}</strong><small>{user.role === 'LOGISTICS' ? 'Deliveries in progress' : 'Updates for your account'}</small></article></section>
    {user.role === 'LOGISTICS' && <section className="orders-section"><div className="dashboard-section-head"><div><p className="eyebrow">DELIVERY QUEUE <span>•</span> LOGISTICS</p><h2>Available pickups</h2></div></div>{readyOrders.map((order) => <article className="order-row" key={order.id}><div><strong>{order.produce.cropName}</strong><span>{order.quantity} {order.produce.unit} · Pickup: {order.produce.location}</span></div><button className="button button-dark" onClick={() => assignDelivery(order.id)}>Assign to me</button></article>)}{deliveries.map((delivery) => <article className="order-row" key={delivery.id}><div><strong>{delivery.order.produce.cropName}</strong><span>{delivery.order.quantity} {delivery.order.produce.unit} · {delivery.order.produce.location} to buyer</span></div><span className="order-status">{delivery.status.replaceAll('_', ' ')}</span>{delivery.status !== 'DELIVERED' && <button className="button button-dark" onClick={() => advanceDelivery(delivery)}>Advance status</button>}</article>)}</section>}
    <section className="orders-section" id="orders"><div className="dashboard-section-head"><div><p className="eyebrow">ORDER WORKFLOW <span>•</span> 02</p><h2>Recent orders</h2></div></div>{loadError && <p className="notice" role="alert">{loadError}</p>}{orders.length ? <div className="order-list">{orders.map((order) => <article className="order-row" key={order.id}><div><strong>{order.produce.cropName}</strong><span>{order.quantity} {order.produce.unit} · {user.role === 'FARMER' ? `Buyer ${order.buyerEmail}` : `Farmer ${order.farmerEmail}`}</span></div><span className={`order-status status-${order.status.toLowerCase()}`}>{order.status.replaceAll('_', ' ')}</span>{user.role === 'FARMER' && order.status === 'PLACED' && <div className="order-actions"><button onClick={() => updateOrder(order.id, 'ACCEPTED')}>Accept</button><button onClick={() => updateOrder(order.id, 'REJECTED')}>Reject</button></div>}</article>)}</div> : <p className="orders-empty">Orders placed for your account will appear here.</p>}</section>
    <section className="dashboard-content"><div className="dashboard-section-head"><div><p className="eyebrow">QUICK ACCESS <span>•</span> 01</p><h2>What would you like to do?</h2></div></div><div className="dashboard-actions">{content.actions.map((action, index) => <Link className="dashboard-action" to={action === 'Add produce' || action === 'Browse produce' || action === 'Marketplace' || action === 'My produce' ? '/marketplace' : action === 'Market Desk' ? '/market-desk' : action === 'AI recommendations' ? '/agri-ai' : action === 'My orders' ? '#orders' : action === 'Profile' ? '#profile' : '#market-tools'} key={action}><span className="action-number">0{index + 1}</span><strong>{action}</strong><span aria-hidden="true">↗</span></Link>)}<Link className="dashboard-action" to="/agri-ai"><span className="action-number">05</span><strong>Ask AgriAI</strong><span aria-hidden="true">↗</span></Link><Link className="dashboard-action" to="/notifications"><span className="action-number">06</span><strong>Notifications{unreadCount > 0 ? ` (${unreadCount} unread)` : ''}</strong><span aria-hidden="true">↗</span></Link></div></section>
    <section className="dashboard-insight" id="market-tools"><div><p className="eyebrow">AI MARKET INSIGHT <span>•</span> DEMO SAMPLE</p><h2>Planning signal, not a promise.</h2><p>This illustrative sample is not generated from live demand, transactions or buyer requirements.</p></div><div className="insight-metrics"><div><span>Best buyer</span><strong>Sample buyer profile</strong></div><div><span>Buyer match</span><strong>Not calculated</strong></div><div><span>Demand score</span><strong>Not calculated</strong></div><div><span>Selling window</span><strong>Needs verified market data</strong></div></div></section>
    <footer className="dashboard-footer"><Link to="/marketplace">← Return to marketplace</Link><span>AgriTrade · Role-based workspace</span></footer>
  </main>
}
