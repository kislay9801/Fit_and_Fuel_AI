import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User, X } from 'lucide-react'
import MarkdownMessage from './MarkdownMessage'

export default function AICoachChat({ sessions, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am your AI Coach. I have your recent session history. What would you like to know about your progress?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message to UI immediately
    const updatedMessages = [...messages, { role: 'user', text: userMessage }]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // Build session context (limit to last 20 sessions to save tokens)
      const contextSessions = sessions.slice(0, 20).map(s => ({
        exercise: s.exercise,
        score: s.score ?? s.form_score,
        reps: s.reps,
        issues: s.issues || []
      }))

      // Prepare API payload
      const payload = {
        message: userMessage,
        chat_history: updatedMessages.slice(0, -1).filter(m => m.role !== 'system'),
        session_context: contextSessions
      }

      const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8000')
      const url = `${apiBase}/api/coaching/chat`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        throw new Error(`HTTP ${response.status} ${response.statusText} — ${errText}`)
      }

      const data = await response.json()

      setMessages(prev => [...prev, { role: 'model', text: data.reply }])
    } catch (err) {
      console.error('[AICoach] Chat error:', err)
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting to my server right now." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full sm:w-[400px] h-[70vh] max-h-[560px] sm:h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold tracking-tight text-white">AI Coach</h3>
            <p className="text-xs text-blue-100 font-medium tracking-wide">Powered by Gemini</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-transparent hover:bg-white/10 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
      >
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user'
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isUser ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                {/* Bubble */}
                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                }`}>
                  {isUser ? msg.text : <MarkdownMessage text={msg.text} />}
                </div>
              </div>
            </div>
          )
        })}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your progress..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-1 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
