interface LivesProps {
  count: number
  total: number
}

export function Lives({ count, total }: LivesProps) {
  return (
    <div className="lives" aria-label={`${count} lives remaining`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`heart ${i < count ? 'heart--active' : 'heart--lost'}`}
          aria-hidden="true"
        >
          {i < count ? '❤️' : '🩶'}
        </span>
      ))}
    </div>
  )
}
