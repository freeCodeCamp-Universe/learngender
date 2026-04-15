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

// fCC Command-line Chic palette
const C = {
  sky:        '#0a0a23', // gray-90 — deep navy
  skyMid:     '#1b1b32', // gray-85
  mtBg:       '#3b3b4f', // gray-75 — background mountain
  mtMain:     '#2a2a40', // gray-80 — main mountain
  snow:       '#dfdfe2', // gray-10
  ground:     '#1b1b32', // gray-85 — dark ground
  groundEdge: '#0a0a23', // gray-90
  tree1:      '#acd157', // fCC green
  tree2:      '#8fb23a', // fCC green darker
  treeTrunk:  '#3b3b4f', // gray-75
  trail:      '#f1be32', // fCC yellow
  trailFill:  '#f1be32', // fCC yellow
  flagPole:   '#858591', // gray-45
  flag:       '#e24b4a', // original warm red
  sun:        '#f1be32', // fCC yellow
}

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
      {/* Sky — deep navy gradient feel */}
      <rect width="320" height="295" fill={C.sky}/>
      <rect width="320" y="180" height="115" fill={C.skyMid} opacity="0.35"/>

      {/* Stars */}
      {[
        [30, 30], [80, 15], [140, 40], [200, 20], [260, 35], [290, 60],
        [50, 65], [110, 55], [230, 50], [170, 25], [310, 25], [15, 80],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#dfdfe2" opacity="0.6"/>
      ))}

      {/* Moon glow */}
      <circle cx="265" cy="65" r="34" fill="#dfdfe2" opacity="0.04"/>
      <circle cx="265" cy="65" r="24" fill="#dfdfe2" opacity="0.08"/>
      {/* Crescent moon — mask cuts shadow side */}
      <defs>
        <mask id="crescent">
          <rect width="320" height="580" fill="white"/>
          <circle cx="274" cy="59" r="12" fill="black"/>
        </mask>
      </defs>
      <circle cx="265" cy="65" r="16" fill="#dfdfe2" opacity="0.92" mask="url(#crescent)"/>

      {/* Background mountain */}
      <polygon points="130,295 260,148 390,295" fill={C.mtBg}/>

      {/* Main mountain */}
      <polygon points="-10,295 145,90 300,295" fill={C.mtMain}/>

      {/* Subtle mountain edge highlight */}
      <polyline
        points="-10,295 145,90 300,295"
        fill="none"
        stroke="#dbb8ff"
        strokeWidth="1"
        opacity="0.12"
      />

      {/* Snow cap */}
      <polygon
        points="108,136 145,90 182,136 165,128 145,112 125,128"
        fill={C.snow}
        opacity="0.9"
      />

      {/* Flag pole */}
      <line x1="145" y1="90" x2="145" y2="60" stroke={C.flagPole} strokeWidth="1.5"/>
      <polygon points="145,60 164,68 145,76" fill={C.flag} opacity="0.95"/>

      {/* Trail path — fCC yellow dashed */}
      <path
        d="M157,290 Q153,265 151,240 Q149,215 148,190 Q147,168 146,148 Q145,130 145,112"
        stroke={C.trail}
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="6,5"
        opacity="0.5"
      />

      {/* Trail circles */}
      {CIRCLE_POSITIONS.map(([cx, cy], i) => {
        const filled = i < hikerStep
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r="5"
            fill={filled ? C.trailFill : 'none'}
            stroke={filled ? C.trailFill : '#858591'}
            strokeWidth="1.5"
            opacity={filled ? 0.9 : Math.max(0.25, 0.6 - i * 0.05)}
          />
        )
      })}

      {/* Ground */}
      <rect x="0" y="295" width="320" height="285" fill={C.ground}/>
      <rect x="0" y="295" width="320" height="8" fill={C.groundEdge} opacity="0.5"/>

      {/* Trees left — fCC green */}
      <polygon points="16,295 28,267 40,295" fill={C.tree1}/>
      <rect x="26" y="291" width="4" height="7" fill={C.treeTrunk}/>
      <polygon points="42,295 53,270 64,295" fill={C.tree2}/>
      <rect x="51" y="291" width="4" height="7" fill={C.treeTrunk}/>

      {/* Trees right */}
      <polygon points="258,295 270,267 282,295" fill={C.tree1}/>
      <rect x="268" y="291" width="4" height="7" fill={C.treeTrunk}/>
      <polygon points="283,295 295,270 307,295" fill={C.tree2}/>
      <rect x="293" y="291" width="4" height="7" fill={C.treeTrunk}/>

      {/* Hiker — walking pose */}
      {!isSummit && (
        <g
          transform={`translate(${hikerPos[0]}, ${hikerPos[1]})`}
          style={{ transition: 'transform 0.4s ease-out' }}
        >
          {/* Backpack */}
          <rect x="4" y="0" width="7" height="10" fill="#4a7c59" rx="2"/>
          {/* Body */}
          <ellipse cx="0" cy="8" rx="5" ry="7" fill="#b57bee"/>
          {/* Head */}
          <circle cx="0" cy="-2" r="5" fill="#f5c5a0"/>
          {/* Hat brim */}
          <ellipse cx="0" cy="-6.5" rx="6" ry="2" fill="#2a1f10"/>
          {/* Hat top */}
          <rect x="-3" y="-11" width="6" height="5" fill="#2a1f10" rx="1"/>
          {/* Arms — fCC yellow sleeves */}
          <line x1="-5" y1="5" x2="-10" y2="13" stroke="#f1be32" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="5" y1="5" x2="10" y2="13" stroke="#f1be32" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Walking stick */}
          <line x1="10" y1="13" x2="13" y2="22" stroke="#6b4c2a" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Legs */}
          <line x1="-2" y1="15" x2="-6" y2="25" stroke="#3b2e1e" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="2" y1="15" x2="5" y2="25" stroke="#3b2e1e" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
      )}

      {/* Hiker — summit/celebrating pose */}
      {isSummit && (
        <g transform="translate(-25, -65)">
          <g className="hiker-summit">
            {/* Body */}
            <ellipse cx="162" cy="156" rx="5" ry="7" fill="#b57bee"/>
            {/* Head */}
            <circle cx="162" cy="146" r="5" fill="#f5c5a0"/>
            {/* Hat brim */}
            <ellipse cx="162" cy="141.5" rx="6" ry="2" fill="#2a1f10"/>
            {/* Hat top */}
            <rect x="159" y="137" width="6" height="5" fill="#2a1f10" rx="1"/>
            {/* Arms raised — fCC yellow */}
            <line x1="157" y1="153" x2="150" y2="143" stroke="#f1be32" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="167" y1="153" x2="174" y2="143" stroke="#f1be32" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Backpack */}
            <rect x="165" y="149" width="6" height="9" fill="#4a7c59" rx="2"/>
            {/* Legs */}
            <line x1="160" y1="163" x2="157" y2="172" stroke="#3b2e1e" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="164" y1="163" x2="167" y2="172" stroke="#3b2e1e" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        </g>
      )}
    </svg>
  )
}
