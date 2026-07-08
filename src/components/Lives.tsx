import heartIcon from './icons/heart.svg'
import { useResolvedTheme } from '../lib/theme'

interface LivesProps {
  count: number
  total: number
}

export function Lives({ count, total }: LivesProps) {
  const isDay = useResolvedTheme() === 'light'
  // Circle gets darker as lives decrease. Light mode uses deeper tones so the
  // segments/heart keep contrast on the pale HUD.
  const pct = count / total
  const circleColor = isDay
    ? (pct > 0.6 ? '#c0392b' : pct > 0.2 ? '#a85a1e' : '#7a4a15')
    : (pct > 0.6 ? '#e05555' : pct > 0.2 ? '#c47a2a' : '#7a5a2a')

  return (
    <div className="lives-bar" role="img" aria-label={`${count} of ${total} lives remaining`}>
      <div className="lives-bar__segments">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`lives-bar__seg ${i >= total - count ? 'lives-bar__seg--active' : 'lives-bar__seg--lost'}`}
            style={i >= total - count ? { background: circleColor } : undefined}
          />
        ))}
      </div>
      <div className="lives-bar__circle" style={{ background: circleColor }}>
        <img src={heartIcon} alt="" width="16" height="16" className="lives-bar__heart" />
      </div>
    </div>
  )
}
