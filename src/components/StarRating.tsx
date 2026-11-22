interface StarRatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md'
  showValue?: boolean
}

function StarSvg({ fill }: { fill: number }) {
  const id = `clip-${Math.random().toString(36).slice(2)}`
  return (
    <svg viewBox="0 0 24 24" className="star-svg" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={24 * fill} height="24" />
        </clipPath>
      </defs>
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44l-5.81 3.06L7.3 14.03 2.6 9.45l6.5-.95L12 2.6z"
        className="star-bg"
      />
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44l-5.81 3.06L7.3 14.03 2.6 9.45l6.5-.95L12 2.6z"
        className="star-fg"
        clipPath={`url(#${id})`}
      />
    </svg>
  )
}

export function StarRating({ value, count, size = 'sm', showValue = true }: StarRatingProps) {
  return (
    <span className={`star-rating star-rating--${size}`} aria-label={`${value} out of 5 stars`}>
      <span className="stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarSvg key={i} fill={Math.min(1, Math.max(0, value - (i - 1)))} />
        ))}
      </span>
      {showValue && <span className="star-value">{value > 0 ? value.toFixed(1) : 'New'}</span>}
      {typeof count === 'number' && count > 0 && <span className="star-count">({count})</span>}
    </span>
  )
}
