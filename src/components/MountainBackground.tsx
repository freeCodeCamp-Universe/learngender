// Mountain: peak at y=90, base at y=295
// Hiker step-0 at y=278, always visible above the card area

const HIKER_POSITIONS: [number, number][] = [
  [148, 278], // step 0 — base (visible above card)
  [152, 258], // step 1
  [150, 236], // step 2
  [148, 214], // step 3
  [147, 192], // step 4
  [146, 170], // step 5
  [145, 148], // step 6
  [145, 126], // step 7
]

const CIRCLE_POSITIONS: [number, number][] = [
  [155, 275],
  [152, 253],
  [150, 231],
  [148, 209],
  [147, 187],
  [146, 165],
  [145, 143],
  [145, 121],
]

interface MountainBackgroundProps {
  hikerStep: number
  isSummit: boolean
}

export function MountainBackground({ hikerStep, isSummit }: MountainBackgroundProps) {
  const hikerPos = HIKER_POSITIONS[Math.min(hikerStep, 7)]

  return (
    <svg
      className="mountain-svg-bg"
      viewBox="0 0 320 580"
      preserveAspectRatio="xMidYMin slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Sky */}
      <rect width="320" height="580" fill="#cce5f6"/>

      {/* Sun */}
      <circle cx="265" cy="72" r="26" fill="#f5d87a" opacity="0.75"/>

      {/* Mountain background — shifted right so it peeks out */}
      <polygon points="130,295 260,148 390,295" fill="#b0c4ac"/>

      {/* Mountain main — peak at 145,90 */}
      <polygon points="-10,295 145,90 300,295" fill="#7a9e72"/>

      {/* Snow cap — calculated to follow mountain slopes from peak (145,90) */}
      <polygon points="108,136 145,90 182,136 165,128 145,112 125,128" fill="white" opacity="0.88"/>

      {/* Flag pole */}
      <line x1="145" y1="90" x2="145" y2="60" stroke="#3a3028" strokeWidth="1.5"/>
      <polygon points="145,60 164,68 145,76" fill="#e24b4a" opacity="0.92"/>

      {/* Trail path */}
      <path
        d="M157,290 Q153,265 151,240 Q149,215 148,190 Q147,168 146,148 Q145,130 145,112"
        stroke="#c8b49a" strokeWidth="3" fill="none" strokeDasharray="7,5" opacity="0.55"
      />

      {/* Trail circles */}
      {CIRCLE_POSITIONS.map(([cx, cy], i) => {
        const filled = i < hikerStep
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r="5"
            fill={filled ? '#f5d87a' : 'none'}
            stroke="white"
            strokeWidth="1.5"
            opacity={filled ? 1 : Math.max(0.3, 0.7 - i * 0.05)}
          />
        )
      })}

      {/* Ground */}
      <rect x="0" y="295" width="320" height="285" fill="#6b9460"/>
      <rect x="0" y="295" width="320" height="14" fill="#5a8050" opacity="0.6"/>

      {/* Trees left */}
      <polygon points="16,295 28,267 40,295" fill="#3d6b42"/>
      <rect x="26" y="291" width="4" height="7" fill="#5a3e28"/>
      <polygon points="42,295 53,270 64,295" fill="#4a7c4a"/>
      <rect x="51" y="291" width="4" height="7" fill="#5a3e28"/>

      {/* Trees right */}
      <polygon points="258,295 270,267 282,295" fill="#3d6b42"/>
      <rect x="268" y="291" width="4" height="7" fill="#5a3e28"/>
      <polygon points="283,295 295,270 307,295" fill="#4a7c4a"/>
      <rect x="293" y="291" width="4" height="7" fill="#5a3e28"/>

      {/* Hiker — walking pose (steps 0–7) */}
      {!isSummit && (
        <g
          transform={`translate(${hikerPos[0]}, ${hikerPos[1]})`}
          style={{ transition: 'transform 0.4s ease-out' }}
        >
          <rect x="4" y="0" width="7" height="10" fill="#4a7c59" rx="2"/>
          <ellipse cx="0" cy="8" rx="5" ry="7" fill="#e07840"/>
          <circle cx="0" cy="-2" r="5" fill="#f5c5a0"/>
          <ellipse cx="0" cy="-6.5" rx="6" ry="2" fill="#5a3e28"/>
          <rect x="-3" y="-11" width="6" height="5" fill="#5a3e28" rx="1"/>
          <line x1="-5" y1="5" x2="-10" y2="13" stroke="#e07840" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="5" y1="5" x2="10" y2="13" stroke="#e07840" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="10" y1="13" x2="13" y2="22" stroke="#8B6340" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="-2" y1="15" x2="-6" y2="25" stroke="#3a3028" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="2" y1="15" x2="5" y2="25" stroke="#3a3028" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
      )}

      {/* Hiker — summit/celebrating pose */}
      {isSummit && (
        <g transform="translate(-25, -65)">
        <g className="hiker-summit">
          <ellipse cx="162" cy="156" rx="5" ry="7" fill="#e07840"/>
          <circle cx="162" cy="146" r="5" fill="#f5c5a0"/>
          <ellipse cx="162" cy="141.5" rx="6" ry="2" fill="#5a3e28"/>
          <rect x="159" y="137" width="6" height="5" fill="#5a3e28" rx="1"/>
          <line x1="157" y1="153" x2="150" y2="143" stroke="#e07840" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="167" y1="153" x2="174" y2="143" stroke="#e07840" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="165" y="149" width="6" height="9" fill="#4a7c59" rx="2"/>
          <line x1="160" y1="163" x2="157" y2="172" stroke="#3a3028" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="164" y1="163" x2="167" y2="172" stroke="#3a3028" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        </g>
      )}
    </svg>
  )
}
