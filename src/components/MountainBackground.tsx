import { useEffect, useRef, useState } from 'react'

interface MountainBackgroundProps {
  rows: number // 0–8; 0 = mountain fully visible, 8 = fully hidden
}

const TOTAL_ROWS = 8

export function MountainBackground({ rows }: MountainBackgroundProps) {
  const prevRows = useRef(rows)
  const [animatingRow, setAnimatingRow] = useState<{ index: number; type: 'fall' | 'rise' } | null>(null)

  useEffect(() => {
    if (rows < prevRows.current) {
      // Row removed (correct answer) — the bottom visible row falls away
      setAnimatingRow({ index: prevRows.current - 1, type: 'fall' })
    } else if (rows > prevRows.current) {
      // Row added (incorrect answer) — new row rises from bottom
      setAnimatingRow({ index: rows - 1, type: 'rise' })
    }
    prevRows.current = rows

    const t = setTimeout(() => setAnimatingRow(null), 400)
    return () => clearTimeout(t)
  }, [rows])

  return (
    <div className="mountain-bg" aria-hidden="true">
      {/* Mountain SVG */}
      <svg
        className="mountain-svg"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a4e" />
            <stop offset="100%" stopColor="#4a5568" />
          </linearGradient>
          <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a5568" />
            <stop offset="100%" stopColor="#2d3748" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="300" fill="url(#sky)" />

        {/* Stars */}
        {[[50, 30], [120, 15], [200, 25], [280, 10], [350, 35], [80, 60], [310, 50]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill="white" opacity="0.8" />
        ))}

        {/* Mountain body */}
        <polygon points="200,20 50,280 350,280" fill="url(#rockGrad)" />
        {/* Second peak (background) */}
        <polygon points="310,80 200,280 380,280" fill="#374151" opacity="0.6" />
        <polygon points="90,100 20,280 200,280" fill="#374151" opacity="0.5" />

        {/* Snow cap */}
        <polygon points="200,20 165,90 235,90" fill="url(#snowGrad)" />

        {/* Flag at summit (hidden until rows === 0) */}
        {rows === 0 && (
          <g className="summit-flag">
            {/* Flagpole */}
            <line x1="200" y1="20" x2="200" y2="5" stroke="white" strokeWidth="1.5" />
            {/* Flag */}
            <polygon points="200,5 215,10 200,15" fill="#ef4444" />
          </g>
        )}
      </svg>

      {/* Block wall overlay */}
      <div className="block-wall">
        {Array.from({ length: TOTAL_ROWS }, (_, i) => {
          const rowIndex = i // 0 = top row, 7 = bottom row
          const isVisible = rowIndex < rows
          const isAnimating = animatingRow?.index === rowIndex

          if (!isVisible && !isAnimating) return null

          return (
            <div
              key={rowIndex}
              className={[
                'block-row',
                isAnimating && animatingRow?.type === 'fall' ? 'block-row--fall' : '',
                isAnimating && animatingRow?.type === 'rise' ? 'block-row--rise' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          )
        })}
      </div>
    </div>
  )
}
