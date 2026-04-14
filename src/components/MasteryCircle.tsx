interface MasteryCircleProps {
  pct: number // 0–100
  size?: number
  textColor?: string
}

export function MasteryCircle({ pct, size = 36, textColor = 'white' }: MasteryCircleProps) {
  const r = (size - 4) / 2
  const circumference = 2 * Math.PI * r
  const filled = (pct / 100) * circumference
  const cx = size / 2
  const cy = size / 2

  // Colour: grey at 0%, green at 100%
  const hue = Math.round(pct * 1.2) // 0 → 0 (red-ish grey), 100 → 120 (green)
  const strokeColor = pct === 0 ? '#4b5563' : `hsl(${hue}, 70%, 50%)`

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${pct}% mastery`}
      role="img"
    >
      {/* Background track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d1ccc7" strokeWidth="3" />
      {/* Progress arc */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Percentage label */}
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize={size * 0.28}
        fill={textColor}
        fontWeight="600"
      >
        {pct}
      </text>
    </svg>
  )
}
