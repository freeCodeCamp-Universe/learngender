import heartIcon from './icons/heart.svg'

interface LivesProps {
  count: number
  total: number
}

export function Lives({ count, total }: LivesProps) {
  // Circle gets darker as lives decrease
  const pct = count / total
  const circleColor = pct > 0.6 ? '#e05555' : pct > 0.2 ? '#c47a2a' : '#7a5a2a'

  return (
    <div className="lives-bar">
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
