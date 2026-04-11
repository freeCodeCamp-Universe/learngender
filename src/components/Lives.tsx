interface LivesProps {
  count: number
}

export function Lives({ count }: LivesProps) {
  return (
    <div className="lives" aria-label={`${count} lives remaining`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`heart ${i < count ? 'heart--active' : 'heart--lost'}`}
          aria-hidden="true"
        >
          {i < count ? '❤️' : '🖤'}
        </span>
      ))}
    </div>
  )
}
