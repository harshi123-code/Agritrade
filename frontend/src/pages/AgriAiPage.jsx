import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/authContext'
import api, { getApiError } from '../services/api'

const topics = [
  { label: 'Produce', prompt: 'How can I improve the quality and storage life of my produce?' },
  { label: 'Buyer', prompt: 'How can I find and evaluate buyers for my produce?' },
  { label: 'Logistics', prompt: 'What should I consider when transporting produce to market?' },
]
const followUps = ['Tell me more', 'Give me a checklist', 'What should I do first?']

export default function AgriAiPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollArea = useRef(null)
  const composer = useRef(null)
  const latestAssistantId = [...messages].reverse().find((message) => message.role === 'assistant')?.id

  useEffect(() => {
    let ignore = false
    if (!user) return undefined
    api.get('/ai/history').then(({ data }) => {
      if (!ignore) setMessages(data.flatMap((item) => [
        { id: `${item.id}-question`, role: 'user', text: item.question },
        { id: `${item.id}-answer`, role: 'assistant', text: item.answer },
      ]))
    }).catch(() => { if (!ignore) setError('Chat history is currently unavailable.') })
    return () => { ignore = true }
  }, [user])

  useEffect(() => { scrollArea.current?.scrollTo({ top: scrollArea.current.scrollHeight, behavior: 'smooth' }) }, [messages, loading])

  async function sendQuestion(event) {
    event.preventDefault()
    const text = question.trim()
    if (!text || loading) return
    setError('')
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', text }])
    setQuestion('')
    setLoading(true)
    try {
      const { data } = await api.post('/ai/chat', { question: text })
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', text: data.answer, sources: data.sources }])
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setLoading(false)
    }
  }

  return <main className="dashboard-page ai-page">
    <header className="dashboard-nav"><Link className="brand" to="/marketplace"><span className="brand-mark">A</span> agri<span>trade</span></Link><nav><Link to="/marketplace">Marketplace</Link><Link to="/market-desk">Market Desk</Link><Link to="/dashboard">Dashboard</Link></nav><span className="ai-role-label">{user?.role || 'GUEST'}</span></header>
    <section className="ai-intro"><p className="eyebrow">AGRITRADE KNOWLEDGE <span>•</span> AI ASSISTANT</p><h1>Ask AgriAI.</h1><p>Get practical help with agriculture, AgriTrade, and your other questions.</p></section>
    <section className="chat-panel" aria-label="AgriAI conversation">
      <div className="chat-heading"><div><span className="ai-indicator" /> AgriAI <span>AGRICULTURAL ASSISTANT</span></div><span>{messages.filter((message) => message.role === 'user').length} questions</span></div>
      <div className="chat-messages" ref={scrollArea} aria-live="polite">
        {messages.length === 0 && <div className="chat-empty"><span className="chat-seed">A</span><h2>What are you working on?</h2><p>Choose a topic or type your own question.</p><div className="ai-topics" aria-label="Suggested topics">{topics.map((topic) => <button type="button" key={topic.label} onClick={() => setQuestion(topic.prompt)} disabled={!user || loading}>{topic.label}</button>)}</div></div>}
        {messages.map((message) => <article className={`chat-message ${message.role}`} key={message.id}><span className="message-avatar">{message.role === 'user' ? user?.name.slice(0, 1).toUpperCase() || 'Y' : 'A'}</span><div><span className="message-name">{message.role === 'user' ? 'You' : 'AgriAI'}</span><p>{message.text}</p>{message.sources?.length > 0 && <span className="message-source">Sources: {message.sources.join(', ')}</span>}{message.role === 'assistant' && message.id === latestAssistantId && <div className="ai-followups" aria-label="Ask a follow-up">{followUps.map((followUp) => <button type="button" key={followUp} disabled={!user || loading} onClick={() => { setQuestion(followUp); composer.current?.focus() }}>{followUp}</button>)}</div>}</div></article>)}
        {loading && <article className="chat-message assistant"><span className="message-avatar">A</span><div><span className="message-name">AgriAI</span><p className="typing-indicator">AgriAI is preparing your answer...</p></div></article>}
      </div>
      {error && <p className="chat-error" role="alert">{error}</p>}
      <form className="chat-composer" onSubmit={sendQuestion}><textarea ref={composer} rows="2" value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form.requestSubmit() } }} placeholder={user ? 'Ask a question or continue the conversation...' : 'Join AgriTrade to ask AgriAI'} disabled={!user || loading} aria-label="Your question" /><button className="button button-dark" disabled={!user || loading || !question.trim()} aria-label="Send message">Send <span aria-hidden="true">↑</span></button></form>
      {!user && <p className="chat-signin">Join AgriTrade to use the assistant. <Link to="/register">Join AgriTrade</Link></p>}
    </section>
    <p className="ai-caution">For crop protection, health, and government program decisions, verify advice with official agricultural extension sources.</p><footer className="dashboard-footer"><Link to="/marketplace">← Return to marketplace</Link><span>AgriTrade · AgriAI</span></footer>
  </main>
}
