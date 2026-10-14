import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './components/authContext'
import api, { getApiError } from './services/api'
import { filterCropListings } from './services/marketplace'
import { cropCatalog, getCropInfo } from './services/cropCatalog'

const emptyForm = { cropName: '', quantity: '', unit: 'kg', pricePerUnit: '', location: '', farmerName: '' }

function App() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [crops, setCrops] = useState([])
  const [query, setQuery] = useState('')
  const [cropFilter, setCropFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [orderQuantity, setOrderQuantity] = useState('')
  const [expandedCropId, setExpandedCropId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)

  async function loadCrops(showLoading = false) {
    if (showLoading) {
      setLoading(true)
      setError('')
    }
    try {
      const { data } = await api.get('/crops')
      setCrops(data)
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    let ignoreResponse = false

    async function loadInitialCrops() {
      try {
        const { data: listings } = await api.get('/crops')
        if (!ignoreResponse) setCrops(listings)
      } catch (requestError) {
        if (!ignoreResponse) setError(getApiError(requestError))
      } finally {
        if (!ignoreResponse) setLoading(false)
      }
    }

    loadInitialCrops()
    return () => { ignoreResponse = true }
  }, [])

  async function submitCrop(event) {
    event.preventDefault()
    setError('')
    try {
      await api.post('/crops', { ...form, quantity: Number(form.quantity), pricePerUnit: Number(form.pricePerUnit) })
      setForm(emptyForm)
      setDialogOpen(false)
      await loadCrops(true)
    } catch (submitError) {
      setError(getApiError(submitError))
    }
  }

  const visibleCrops = filterCropListings(crops, { query, crop: cropFilter, location: locationFilter })
  const cropResources = [...new Map(crops.map((crop) => [crop.cropName.toLowerCase(), crop.cropName])).values()]

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="AgriTrade home"><span className="brand-mark">A</span> agri<span>trade</span></a>
        <nav className="primary-nav" aria-label="Main navigation"><a className="active" href="#market">Marketplace</a><Link to="/market-desk">Market Desk</Link><a href="#insights">Market insights</a></nav>
        <div className="top-actions">{user ? <><Link className="top-link" to="/dashboard">Dashboard</Link><Link className="top-link" to="/agri-ai">Ask AgriAI</Link>{user.role === 'FARMER' && <button className="button button-dark top-action" onClick={() => setDialogOpen(true)}>+ Sell crops</button>}<button className="button button-dark top-action" onClick={logout}>Log out</button></> : <><Link className="top-link" to="/login">Login</Link><button className="button button-dark top-action" onClick={() => navigate('/register')}>Join AgriTrade</button></>}</div>
      </header>

      <main id="home">
        <section className="intro" id="market">
          <div className="intro-copy"><p className="eyebrow">THE FARMER'S MARKETPLACE <span>•</span> INDIA</p><h1>Good harvest.<br /><em>Fair market.</em></h1><p className="intro-text">A clearer way to connect fresh produce with the people who need it.</p><div className="intro-actions"><button className="button button-dark" onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}>Explore produce <span aria-hidden="true">↓</span></button><span className="trust-note"><span className="status-dot" /> Direct from local growers</span></div></div>
          <div className="harvest-art" role="img" aria-label="Illustration of a freshly harvested field"><div className="sun"/><div className="hill hill-back"/><div className="hill hill-front"/><div className="crop-row row-one"/><div className="crop-row row-two"/><div className="art-caption"><span>01 / HARVEST SEASON</span><span>GROWN WITH CARE</span></div></div>
        </section>

        <section className="market-strip" aria-label="Marketplace summary"><div><span className="strip-label">OPEN LISTINGS</span><strong>{crops.length.toString().padStart(2, '0')}</strong></div><div><span className="strip-label">BUILT FOR</span><strong>Farmers &amp; buyers</strong></div><div><span className="strip-label">MARKETPLACE</span><strong>Local, direct, fair</strong></div><p>Harvest connects here.</p></section>

        <section className="listings-section" id="listings"><div className="section-heading"><div><p className="eyebrow">FRESH FROM THE FARM <span>•</span> 01</p><h2>Available produce</h2></div><div className="marketplace-filters"><label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search everything" aria-label="Search all produce details" /></label><label className="filter-input"><span>Crop</span><input value={cropFilter} onChange={(event) => setCropFilter(event.target.value)} placeholder="e.g. rice" aria-label="Filter by crop" /></label><label className="filter-input"><span>Location</span><input value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} placeholder="e.g. Nizamabad" aria-label="Filter by location" /></label></div></div>
          {error && <div className="notice" role="alert">{error}<button onClick={() => loadCrops(true)}>Retry</button></div>}
        {loading ? <p className="empty-state">Loading current listings…</p> : visibleCrops.length ? <div className="crop-grid">{visibleCrops.map((crop, index) => { const cropInfo = getCropInfo(crop.cropName); return <article className="crop-card" key={crop.id}><div className="crop-visual" style={cropInfo.imageUrl ? { backgroundImage: `linear-gradient(180deg, transparent 58%, #172217a8 100%), url("${cropInfo.imageUrl}")` } : undefined}><span className="crop-number">LOT {String(index + 1).padStart(2, '0')}</span>{!cropInfo.imageUrl && <span className="crop-emoji" aria-hidden="true">{cropInfo.icon}</span>}<span className="crop-unit">{crop.quantity} {crop.unit}</span></div><div className="crop-details"><div><h3>{crop.cropName}</h3><p>{crop.location} <span>·</span> {crop.farmerName}</p></div><div className="crop-price"><strong>₹{Number(crop.pricePerUnit).toLocaleString('en-IN')}</strong><span>/ {crop.unit}</span></div></div>{cropInfo.imageSource && <a className="image-credit" href={cropInfo.imageSource} target="_blank" rel="noreferrer">Photo source · Wikimedia Commons</a>}<div className="crop-actions"><button className="text-action" onClick={() => setExpandedCropId(expandedCropId === crop.id ? null : crop.id)}>{expandedCropId === crop.id ? 'Hide details' : 'View details'}</button>{user?.role === 'BUYER' && <button className="button button-dark" onClick={() => { setSelectedCrop(crop); setOrderQuantity('') }}>Place order</button>}{!user && <button className="button button-dark" onClick={() => navigate('/login')}>Login to order</button>}</div>{expandedCropId === crop.id && <p className="crop-expanded">Available quantity: {crop.quantity} {crop.unit}. Listed by {crop.farmerName} in {crop.location}.</p>}</article> })}</div> : <p className="empty-state">{query || cropFilter || locationFilter ? 'No crops match those filters.' : 'No crops listed yet. Be the first to add a harvest.'}</p>}
        </section>

          <section className="icar-resources" aria-labelledby="icar-heading"><div className="icar-heading"><div><p className="eyebrow">CROP KNOWLEDGE <span>•</span> OFFICIAL RESEARCH LINKS</p><h2 id="icar-heading">ICAR crop resources</h2></div><p>Browse institute resources for crops currently listed in the marketplace. Advice may vary by region and variety; follow the linked institute guidance.</p></div>{loading ? <p className="empty-state">Loading crops from MySQL…</p> : cropResources.length ? <div className="icar-resource-list">{cropResources.map((cropName) => { const cropInfo = getCropInfo(cropName); return <a className="icar-resource-row" href={cropInfo.instituteUrl} target="_blank" rel="noreferrer" key={cropName}><span className="resource-crop-icon" aria-hidden="true">{cropInfo.icon}</span><strong>{cropName}</strong><span>{cropInfo.institute}</span><span className="resource-arrow" aria-hidden="true">↗</span></a> })}</div> : <p className="empty-state">Crop resources will appear when crop listings are available.</p>}<p className="icar-note">These are links to ICAR institutes, not automatically imported recommendations. Market prices continue to come from your MySQL Market Desk table.</p></section>

        <section className="insight-band" id="insights"><div><p className="eyebrow">MARKET DESK <span>•</span> EARLY ACCESS</p><h2>Better decisions start<br />with better information.</h2></div><p>Demand forecasts, buyer matching and agricultural knowledge tools are planned next. This starter keeps the foundation simple and ready to grow.</p><span className="insight-index">02</span></section>
      </main>

      <footer><a className="brand" href="#home"><span className="brand-mark">A</span> agri<span>trade</span></a><span>Connecting India's harvest to its market.</span><span>© 2026 AGRITRADE</span></footer>

      {dialogOpen && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false) }}><section className="listing-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="dialog-heading"><div><p className="eyebrow">NEW MARKET LISTING</p><h2 id="dialog-title">List your harvest</h2></div><button className="close-button" aria-label="Close" onClick={() => setDialogOpen(false)}>×</button></div><form onSubmit={submitCrop}><label>Crop name<select required value={form.cropName} onChange={(event) => setForm({ ...form, cropName: event.target.value })}><option value="">Select a crop</option>{Object.keys(cropCatalog).map((cropName) => { const label = cropName.replace(/\b\w/g, (letter) => letter.toUpperCase()); return <option key={cropName} value={label}>{label}</option> })}</select></label><div className="form-row"><label>Quantity<input required type="number" min="0.01" step="0.01" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} placeholder="500" /></label><label>Unit<select value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })}><option>kg</option><option>quintal</option><option>tonne</option><option>dozen</option></select></label></div><label>Price per unit (₹)<input required type="number" min="0.01" step="0.01" value={form.pricePerUnit} onChange={(event) => setForm({ ...form, pricePerUnit: event.target.value })} placeholder="42" /></label><label>Farm location<input required maxLength="120" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="District, State" /></label><label>Farmer name<input required maxLength="100" value={form.farmerName} onChange={(event) => setForm({ ...form, farmerName: event.target.value })} placeholder="Your name" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark submit-button" type="submit">Publish listing <span aria-hidden="true">→</span></button></form></section></div>}
      {selectedCrop && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedCrop(null) }}><section className="listing-dialog" role="dialog" aria-modal="true" aria-labelledby="order-title"><div className="dialog-heading"><div><p className="eyebrow">BUYER ORDER</p><h2 id="order-title">Order {selectedCrop.cropName}</h2></div><button className="close-button" aria-label="Close" onClick={() => setSelectedCrop(null)}>×</button></div><form onSubmit={async (event) => { event.preventDefault(); try { await api.post('/orders', { produceId: selectedCrop.id, quantity: Number(orderQuantity) }); setSelectedCrop(null); setError('Order placed. Track it in your dashboard.'); } catch (requestError) { setError(getApiError(requestError)); } }}><p className="auth-subtitle">{selectedCrop.quantity} {selectedCrop.unit} available · ₹{Number(selectedCrop.pricePerUnit).toLocaleString('en-IN')} / {selectedCrop.unit}</p><label>Order quantity ({selectedCrop.unit})<input required type="number" min="0.01" max={selectedCrop.quantity} step="0.01" value={orderQuantity} onChange={(event) => setOrderQuantity(event.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark submit-button">Submit order request <span aria-hidden="true">→</span></button></form></section></div>}
    </div>
  )
}

export default App
