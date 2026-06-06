import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Frontend render error:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#F9FAFB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          maxWidth: '560px',
          width: '100%',
          background: '#111827',
          border: '1px solid #374151',
          borderRadius: '14px',
          padding: '24px',
        }}>
          <h1 style={{ fontSize: '20px', marginBottom: '10px' }}>Something went wrong</h1>
          <p style={{ color: '#9CA3AF', lineHeight: 1.6, marginBottom: '16px' }}>
            The frontend hit a runtime error. Refresh the page after the dev server restarts.
          </p>
          <pre style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: '#FCA5A5',
            background: '#0f172a',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '12px',
          }}>
            {this.state.error.message}
          </pre>
        </div>
      </div>
    )
  }
}
