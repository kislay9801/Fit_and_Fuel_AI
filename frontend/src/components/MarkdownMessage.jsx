/**
 * Minimal markdown renderer for chat/coaching text.
 * Handles the formatting the AI coach actually produces — **bold**, *italic*,
 * `code`, bullet lists (-, *, •), numbered lists (1.), and paragraphs — without
 * pulling in a full markdown dependency.
 */

function renderInline(text, keyPrefix) {
  const nodes = []
  let rest = String(text)
  let i = 0
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`/

  let match
  while ((match = re.exec(rest)) !== null) {
    const before = rest.slice(0, match.index)
    if (before) nodes.push(before)

    if (match[1] != null) {
      nodes.push(<strong key={`${keyPrefix}-b${i++}`}>{match[1]}</strong>)
    } else if (match[2] != null) {
      nodes.push(<em key={`${keyPrefix}-i${i++}`}>{match[2]}</em>)
    } else if (match[3] != null) {
      nodes.push(
        <code key={`${keyPrefix}-c${i++}`} className="px-1 py-0.5 bg-black/5 rounded text-[0.85em] font-mono">
          {match[3]}
        </code>
      )
    }
    rest = rest.slice(match.index + match[0].length)
  }
  if (rest) nodes.push(rest)
  return nodes
}

export default function MarkdownMessage({ text, className = '' }) {
  const lines = String(text || '').split('\n')
  const blocks = []
  let list = null

  const flushList = () => {
    if (list) { blocks.push(list); list = null }
  }

  lines.forEach((raw) => {
    const line = raw.trimEnd()
    const bullet = line.match(/^\s*[-*•]\s+(.*)/)
    const numbered = line.match(/^\s*\d+\.\s+(.*)/)

    if (bullet) {
      if (!list || list.type !== 'ul') { flushList(); list = { type: 'ul', items: [] } }
      list.items.push(bullet[1])
    } else if (numbered) {
      if (!list || list.type !== 'ol') { flushList(); list = { type: 'ol', items: [] } }
      list.items.push(numbered[1])
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      blocks.push({ type: 'p', text: line })
    }
  })
  flushList()

  return (
    <div className={`space-y-2 ${className}`}>
      {blocks.map((b, i) => {
        if (b.type === 'p') return <p key={i}>{renderInline(b.text, i)}</p>
        if (b.type === 'ul') {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {b.items.map((it, j) => <li key={j}>{renderInline(it, `${i}-${j}`)}</li>)}
            </ul>
          )
        }
        return (
          <ol key={i} className="list-decimal pl-5 space-y-1">
            {b.items.map((it, j) => <li key={j}>{renderInline(it, `${i}-${j}`)}</li>)}
          </ol>
        )
      })}
    </div>
  )
}
