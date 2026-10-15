import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { filterMarketRows } from '../services/marketData'

export default function MarketDeskPage() {
  const [rows, setRows] = useState([])
  const [cropFilter, setCropFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    api.get('/market-data').then(({ data }) => { if (!ignore) setRows(data) }).catch(() => { if (!ignore) setError('Could not load market rows. Check that the backend is running and connected to MySQL.') }).finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [])

  const visibleRows = filterMarketRows(rows, cropFilter, locationFilter)
  const highest = Math.max(...visibleRows.map((item) => Number(item.currentPrice)), 1)
  const hasSampleRows = visibleRows.some((row) => row.sampleData)
  return <main className="dashboard-page market-page"><header className="dashboard-nav"><Link className="brand" to="/marketplace"><span className="brand-mark">A</span> agri<span>trade</span></Link><nav><Link to="/marketplace">Marketplace</Link><Link to="/dashboard">Dashboard</Link></nav><Link className="top-link" to="/register">Join AgriTrade</Link></header>
    <section className="dashboard-intro"><div><p className="eyebrow">MARKET DESK <span>•</span> PRICE SNAPSHOT</p><h1>Know the market.</h1><p>A quick view of crop prices and reported demand across selected markets.</p></div>{hasSampleRows && <span className="sample-pill">SAMPLE DATA · NOT LIVE PRICES</span>}</section>
    {error && <p className="notice" role="alert">{error}</p>}
    <section className="market-filters"><label className="filter-input"><span>Filter crop</span><input value={cropFilter} onChange={(event) => setCropFilter(event.target.value)} placeholder="Turmeric, rice…" /></label><label className="filter-input"><span>Filter location</span><input value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} placeholder="Market or region" /></label></section>
    <section className="market-table-wrap"><table className="market-table"><thead><tr><th>Crop</th><th>Market</th><th>Location</th><th>Current price <small>/ unit</small></th><th>Demand</th><th>Recorded</th><th>Source</th></tr></thead><tbody>{visibleRows.map((row) => <tr key={row.id}><td><strong>{row.crop ?? row.cropName}</strong></td><td>{row.market ?? row.marketName}</td><td>{row.location}</td><td className="price-cell">₹{Number(row.currentPrice ?? row.marketPrice).toFixed(2)}</td><td><span className={`demand-tag demand-${String(row.demand ?? row.demandLevel ?? '').toLowerCase()}`}>{row.demand ?? row.demandLevel}</span></td><td>{row.priceDate ?? row.recordedDate ?? 'Date unavailable'}</td><td><span className="source-tag source-sample">Sample</span></td></tr>)}</tbody></table>{loading && <p className="empty-state">Loading market information…</p>}{!loading && !error && !rows.length && <p className="empty-state">No market rows are stored in the database yet.</p>}{!loading && rows.length > 0 && !visibleRows.length && <p className="empty-state">No market rows match those filters.</p>}</section>
    <section className="price-chart"><div className="chart-heading"><div><p className="eyebrow">PRICE COMPARISON <span>•</span> SNAPSHOT</p><h2>Price comparison by crop</h2></div><span>Current recorded values · not a trend</span></div><div className="chart-bars">{visibleRows.map((row) => <div className="chart-item" key={row.id}><div className="bar-track"><span className="bar-fill" style={{ height: `${Math.max(8, Number(row.currentPrice ?? row.marketPrice) / highest * 100)}%` }} /></div><strong>₹{Number(row.currentPrice ?? row.marketPrice).toFixed(0)}</strong><span>{row.crop ?? row.cropName}</span></div>)}</div><p className="chart-note">The provided database rows are dated snapshots, not a live market feed. Use a verified market-data provider to supply real-time prices before treating prices as live.</p></section>
    <footer className="dashboard-footer"><Link to="/marketplace">← Return to marketplace</Link><span>AgriTrade · Market Desk</span></footer>
  </main>
}
