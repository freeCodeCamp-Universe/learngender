import { useResolvedTheme } from '../lib/theme'

// Ring track colour per theme — visible against the card in each (≥3:1).
function trackColorFor(isDay: boolean): string {
  return isDay ? '#9a938c' : '#d1ccc7'
}

interface MasteryCircleProps {
  pct: number // 0–100
  size?: number
  textColor?: string
}

export function MasteryCircle({ pct, size = 36, textColor = 'currentColor' }: MasteryCircleProps) {
  const isDay = useResolvedTheme() === 'light'
  const r = (size - 4) / 2
  const circumference = 2 * Math.PI * r
  const filled = (pct / 100) * circumference
  const cx = size / 2
  const cy = size / 2

  // Discrete red → orange → green bands. Distinct hues are far easier to tell
  // apart at a glance than a continuous ramp (which collapses into muddy ochre
  // in the mid-range); the number inside carries the exact value.
  const band =
    pct < 34 ? (isDay ? '#db3b2f' : '#f2635c')   // just starting
    : pct < 67 ? (isDay ? '#e8850f' : '#ffab3d') // getting there
    : (isDay ? '#2f9e44' : '#94d13d')            // almost mastered
  const strokeColor = pct === 0 ? trackColorFor(isDay) : band
  // Track needs enough contrast against the card in each theme (≥3:1)
  const trackColor = trackColorFor(isDay)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${pct}% mastery`}
      role="img"
    >
      {/* Background track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth="3" />
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
