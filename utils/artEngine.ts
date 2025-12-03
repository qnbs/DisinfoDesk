
const GRIDS = {
  dots: `<pattern id="p-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)"/></pattern>`,
  hex: `<pattern id="p-hex" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>`,
  waves: `<pattern id="p-waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>`,
  polar: `<pattern id="p-polar" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.05)"/><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)"/></pattern>`,
  standard: `<pattern id="p-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>`,
  checkers: `<pattern id="p-checkers" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="20" height="20" fill="rgba(255,255,255,0.1)"/><rect x="20" y="20" width="20" height="20" fill="rgba(255,255,255,0.1)"/></pattern>`,
  matrix: `<pattern id="p-matrix" x="0" y="0" width="20" height="40" patternUnits="userSpaceOnUse"><text x="0" y="20" fill="#22c55e" font-family="monospace" font-size="20" opacity="0.5">1</text><text x="10" y="40" fill="#22c55e" font-family="monospace" font-size="20" opacity="0.3">0</text></pattern>`
};

interface ArtConfig {
  bgGradient: string[];
  accentColor: string;
  shapes: string;
  overlay: string;
}

const THEORY_ART_CONFIG: Record<string, ArtConfig> = {
  // --- BATCH 1 (PSEUDOSCIENCE) ---
  't1': {
    bgGradient: ['#0f172a', '#1e293b'],
    accentColor: '#38bdf8',
    shapes: `
      <ellipse cx="400" cy="450" rx="300" ry="100" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2" opacity="0.8"/>
      <path d="M100 450 Q400 250 700 450" fill="none" stroke="#e0f2fe" stroke-width="2" stroke-dasharray="10 5" opacity="0.5"/>
      <path d="M100 450 L100 500 Q400 600 700 500 L700 450" fill="url(#grad-radial-white)" opacity="0.1"/>
      <rect x="395" y="200" width="10" height="250" fill="#38bdf8" opacity="0.5"/>
      <circle cx="400" cy="200" r="40" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="400" cy="200" r="5" fill="#fff" filter="url(#glow-t1)"/>
    `,
    overlay: GRIDS.polar
  },
  't2': {
    bgGradient: ['#3b82f6', '#93c5fd'],
    accentColor: '#fff',
    shapes: `
      <line x1="0" y1="100" x2="800" y2="100" stroke="#fff" stroke-width="2" opacity="0.3"/>
      <line x1="0" y1="200" x2="800" y2="200" stroke="#fff" stroke-width="2" opacity="0.3"/>
      <line x1="0" y1="300" x2="800" y2="300" stroke="#fff" stroke-width="2" opacity="0.3"/>
      <path d="M-100 500 L900 100" stroke="#fff" stroke-width="15" stroke-linecap="round" filter="url(#glow-t2)" opacity="0.8"/>
      <path d="M-100 550 L900 150" stroke="#fff" stroke-width="15" stroke-linecap="round" filter="url(#glow-t2)" opacity="0.8"/>
      <circle cx="600" cy="100" r="30" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.6"/>
      <path d="M580 80 L620 120 M580 120 L620 80" stroke="#ef4444" stroke-width="2"/>
    `,
    overlay: GRIDS.standard
  },
  't6': {
    bgGradient: ['#2e1065', '#4c1d95'],
    accentColor: '#d8b4fe',
    shapes: `
      <path d="M400 100 L350 550 L450 550 Z" fill="none" stroke="#a855f7" stroke-width="2"/>
      <circle cx="400" cy="100" r="10" fill="#d8b4fe" filter="url(#glow-t6)"/>
      <path d="M400 100 Q100 150 50 400" fill="none" stroke="#d8b4fe" stroke-width="2" opacity="0.5"/>
      <path d="M400 100 Q700 150 750 400" fill="none" stroke="#d8b4fe" stroke-width="2" opacity="0.5"/>
      <path d="M400 100 Q200 200 150 500" fill="none" stroke="#d8b4fe" stroke-width="2" opacity="0.3"/>
      <path d="M400 100 Q600 200 650 500" fill="none" stroke="#d8b4fe" stroke-width="2" opacity="0.3"/>
      <circle cx="400" cy="300" r="150" fill="none" stroke="#ef4444" stroke-width="1" stroke-dasharray="5 5" opacity="0.4"/>
    `,
    overlay: GRIDS.hex
  },
  't11': {
    bgGradient: ['#0f172a', '#b91c1c'],
    accentColor: '#fca5a5',
    shapes: `
      <circle cx="400" cy="600" r="300" fill="#1e293b"/>
      <path d="M0 0 L400 350 L800 0" fill="#f87171" opacity="0.2"/>
      <circle cx="400" cy="350" r="20" fill="#fff" filter="url(#glow-t11)"/>
      <path d="M380 0 L400 330 L420 0" fill="url(#grad-radial-white)" opacity="0.6"/>
      <circle cx="400" cy="350" r="100" fill="none" stroke="#fca5a5" stroke-width="2" opacity="0.5"/>
      <circle cx="400" cy="350" r="180" fill="none" stroke="#fca5a5" stroke-width="1" opacity="0.3"/>
    `,
    overlay: GRIDS.dots
  },
  't12': {
    bgGradient: ['#000000', '#312e81'],
    accentColor: '#818cf8',
    shapes: `
      <path d="M100 300 Q400 100 700 300 T1300 300" fill="none" stroke="#6366f1" stroke-width="4" filter="url(#glow-t12)"/>
      <path d="M100 300 Q400 500 700 300 T1300 300" fill="none" stroke="#818cf8" stroke-width="2" opacity="0.7"/>
      <circle cx="400" cy="300" r="50" fill="url(#grad-radial-purple)" opacity="0.5"/>
      <line x1="400" y1="100" x2="400" y2="500" stroke="#c7d2fe" stroke-width="1" stroke-dasharray="10 10"/>
      <circle cx="400" cy="300" r="10" fill="#fff" filter="url(#glow-t12)"/>
    `,
    overlay: GRIDS.waves
  },

  // --- BATCH 2 (PSEUDOSCIENCE) ---
  't19': {
    bgGradient: ['#27272a', '#ca8a04'],
    accentColor: '#facc15',
    shapes: `
      <path d="M100 500 L400 200 L700 500 Z" fill="#451a03" stroke="#facc15" stroke-width="2"/>
      <path d="M250 500 L400 350 L550 500 Z" fill="#78350f" opacity="0.5"/>
      <circle cx="400" cy="100" r="40" fill="#fff" filter="url(#glow-t19)" opacity="0.8"/>
      <line x1="400" y1="100" x2="400" y2="200" stroke="#facc15" stroke-width="3" opacity="0.6"/>
      <circle cx="100" cy="100" r="2" fill="#fff"/> <circle cx="700" cy="150" r="2" fill="#fff"/>
      <circle cx="200" cy="80" r="1" fill="#fff"/> <circle cx="600" cy="50" r="2" fill="#fff"/>
    `,
    overlay: GRIDS.hex
  },
  't21': {
    bgGradient: ['#172554', '#1e3a8a'],
    accentColor: '#60a5fa',
    shapes: `
      <rect x="0" y="450" width="800" height="150" fill="#0f172a"/>
      <line x1="100" y1="450" x2="100" y2="300" stroke="#94a3b8" stroke-width="2"/>
      <line x1="200" y1="450" x2="200" y2="300" stroke="#94a3b8" stroke-width="2"/>
      <line x1="300" y1="450" x2="300" y2="300" stroke="#94a3b8" stroke-width="2"/>
      <line x1="400" y1="450" x2="400" y2="300" stroke="#94a3b8" stroke-width="2"/>
      <line x1="500" y1="450" x2="500" y2="300" stroke="#94a3b8" stroke-width="2"/>
      <line x1="600" y1="450" x2="600" y2="300" stroke="#94a3b8" stroke-width="2"/>
      <line x1="700" y1="450" x2="700" y2="300" stroke="#94a3b8" stroke-width="2"/>
      <path d="M0 200 Q200 100 400 200 T800 200" fill="none" stroke="#60a5fa" stroke-width="3" filter="url(#glow-t21)"/>
      <path d="M0 150 Q200 50 400 150 T800 150" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
    `,
    overlay: GRIDS.standard
  },
  't50': {
    bgGradient: ['#000000', '#14532d'],
    accentColor: '#4ade80',
    shapes: `
      <path d="M200 500 L400 150 L600 500 Z" fill="#0f172a" stroke="#166534" stroke-width="4"/>
      <circle cx="400" cy="150" r="10" fill="#4ade80" filter="url(#glow-t50)"/>
      <line x1="400" y1="150" x2="800" y2="0" stroke="#4ade80" stroke-width="2" opacity="0.8"/>
      <path d="M300 500 L400 350 L500 500 Z" fill="none" stroke="#166534" stroke-width="1"/>
      <rect x="0" y="0" width="800" height="600" fill="url(#p-hex)" opacity="0.1"/>
    `,
    overlay: GRIDS.hex
  },
  't51': {
    bgGradient: ['#082f49', '#0e7490'],
    accentColor: '#22d3ee',
    shapes: `
      <circle cx="400" cy="300" r="200" fill="none" stroke="#155e75" stroke-width="30"/>
      <circle cx="400" cy="300" r="120" fill="none" stroke="#155e75" stroke-width="30"/>
      <circle cx="400" cy="300" r="40" fill="#0e7490"/>
      <rect x="380" y="0" width="40" height="300" fill="#0891b2" opacity="0.3"/>
      <path d="M0 400 Q400 350 800 400 L800 600 L0 600 Z" fill="#164e63" opacity="0.8"/>
      <circle cx="400" cy="300" r="5" fill="#fff" filter="url(#glow-t51)"/>
    `,
    overlay: GRIDS.waves
  },
  't56': {
    bgGradient: ['#1e1b4b', '#312e81'],
    accentColor: '#f43f5e',
    shapes: `
      <circle cx="400" cy="300" r="200" fill="none" stroke="#4338ca" stroke-width="2"/>
      <line x1="400" y1="100" x2="400" y2="500" stroke="#6366f1" stroke-width="2" stroke-dasharray="5 5"/>
      <line x1="200" y1="300" x2="600" y2="300" stroke="#6366f1" stroke-width="2" stroke-dasharray="5 5"/>
      <path d="M350 50 L450 150 M350 150 L450 50" stroke="#f43f5e" stroke-width="4"/>
      <path d="M400 100 Q500 200 600 150" fill="none" stroke="#f43f5e" stroke-width="2" marker-end="url(#arrow)"/>
      <circle cx="400" cy="300" r="180" fill="url(#p-grid)" opacity="0.2" transform="rotate(15 400 300)"/>
    `,
    overlay: GRIDS.polar
  },

  // --- BATCH 3 (GEOPOLITICS & MYTHS) ---
  't5': { // NWO
    bgGradient: ['#020617', '#172554'],
    accentColor: '#ef4444',
    shapes: `
      <path d="M200 500 L600 500 L550 400 L250 400 Z" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <path d="M270 400 L530 400 L500 300 L300 300 Z" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <path d="M350 150 L450 150 L400 50 Z" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M370 110 Q400 80 430 110 Q400 140 370 110" fill="#fff"/>
      <circle cx="400" cy="110" r="10" fill="#ef4444" filter="url(#glow-t5)"/>
      <line x1="400" y1="50" x2="400" y2="10" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
      <line x1="350" y1="150" x2="300" y2="200" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
      <line x1="450" y1="150" x2="500" y2="200" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
    `,
    overlay: GRIDS.standard
  },
  't7': { // QAnon
    bgGradient: ['#000000', '#3f0c0c'],
    accentColor: '#ef4444',
    shapes: `
      <circle cx="400" cy="300" r="150" fill="none" stroke="#ef4444" stroke-width="20" opacity="0.8"/>
      <rect x="450" y="380" width="20" height="100" fill="#ef4444" transform="rotate(-45 450 380)"/>
      <path d="M400 300 Q450 250 500 300 T600 300" fill="none" stroke="#fff" stroke-width="1" opacity="0.2"/>
      <path d="M0 0 L800 0 L800 200 Q600 250 400 150 Q200 250 0 200 Z" fill="#1f2937" opacity="0.9"/>
      <path d="M100 100 L120 150 L140 100" stroke="#facc15" stroke-width="2" fill="none"/>
    `,
    overlay: GRIDS.dots
  },
  't9': { // Great Replacement
    bgGradient: ['#1c1917', '#44403c'],
    accentColor: '#f59e0b',
    shapes: `
      <rect x="0" y="400" width="800" height="200" fill="url(#p-checkers)" opacity="0.3"/>
      <circle cx="200" cy="450" r="30" fill="#57534e"/>
      <path d="M170 550 L230 550 L200 450 Z" fill="#57534e"/>
      <circle cx="600" cy="450" r="30" fill="#d6d3d1"/>
      <path d="M570 550 L630 550 L600 450 Z" fill="#d6d3d1"/>
      <path d="M300 200 Q400 100 500 200" fill="none" stroke="#f59e0b" stroke-width="5" marker-end="url(#arrow)"/>
      <path d="M500 300 Q400 400 300 300" fill="none" stroke="#ef4444" stroke-width="5" marker-end="url(#arrow)" stroke-dasharray="10 5"/>
    `,
    overlay: GRIDS.standard
  },
  't14': { // Blue Beam
    bgGradient: ['#020617', '#1e1b4b'],
    accentColor: '#38bdf8',
    shapes: `
      <rect x="350" y="50" width="100" height="60" fill="#94a3b8"/>
      <line x1="350" y1="80" x2="250" y2="80" stroke="#94a3b8" stroke-width="5"/>
      <line x1="450" y1="80" x2="550" y2="80" stroke="#94a3b8" stroke-width="5"/>
      <path d="M400 110 L100 600 L700 600 Z" fill="url(#grad-radial-white)" opacity="0.1"/>
      <line x1="400" y1="110" x2="200" y2="500" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2"/>
      <line x1="400" y1="110" x2="600" y2="500" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2"/>
      <path d="M350 450 Q400 350 450 450 L450 550 L350 550 Z" fill="#38bdf8" opacity="0.3" filter="url(#glow-t14)"/>
      <circle cx="400" cy="400" r="30" fill="#fff" opacity="0.5"/>
    `,
    overlay: GRIDS.hex
  },
  't18': { // 9/11
    bgGradient: ['#451a03', '#78350f'],
    accentColor: '#f97316',
    shapes: `
      <rect x="250" y="100" width="80" height="500" fill="#1c1917"/>
      <rect x="470" y="100" width="80" height="500" fill="#1c1917"/>
      <circle cx="290" cy="200" r="60" fill="#78716c" opacity="0.8"/>
      <circle cx="320" cy="180" r="50" fill="#57534e" opacity="0.8"/>
      <circle cx="260" cy="220" r="70" fill="#44403c" opacity="0.8"/>
      <circle cx="290" cy="300" r="5" fill="#f97316" filter="url(#glow-t18)"/>
      <circle cx="290" cy="350" r="5" fill="#f97316" filter="url(#glow-t18)"/>
      <circle cx="290" cy="400" r="5" fill="#f97316" filter="url(#glow-t18)"/>
      <circle cx="290" cy="450" r="5" fill="#f97316" filter="url(#glow-t18)"/>
      <path d="M600 100 Q500 150 290 200" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="10 10" opacity="0.3"/>
    `,
    overlay: GRIDS.dots
  },

  // --- BATCH 4 (GEOPOLITICS) ---
  't20': { // The Great Reset
    bgGradient: ['#111827', '#374151'],
    accentColor: '#4ade80',
    shapes: `
      <circle cx="400" cy="300" r="150" fill="none" stroke="#4b5563" stroke-width="20" stroke-linecap="round" stroke-dasharray="700" stroke-dashoffset="200" transform="rotate(-90 400 300)"/>
      <line x1="400" y1="150" x2="400" y2="300" stroke="#4ade80" stroke-width="20" stroke-linecap="round" filter="url(#glow-t20)"/>
      <circle cx="400" cy="300" r="250" fill="none" stroke="#1f2937" stroke-width="2"/>
      <path d="M150 300 L650 300 M400 50 L400 550" stroke="#1f2937" stroke-width="1"/>
      <rect x="300" y="500" width="200" height="50" fill="url(#p-grid)" opacity="0.5"/>
    `,
    overlay: GRIDS.hex
  },
  't30': { // Adrenochrome
    bgGradient: ['#450a0a', '#000000'],
    accentColor: '#dc2626',
    shapes: `
      <path d="M400 100 L550 200 L550 400 L400 500 L250 400 L250 200 Z" fill="none" stroke="#fff" stroke-width="4" opacity="0.5"/>
      <circle cx="400" cy="300" r="80" fill="#dc2626" opacity="0.2"/>
      <path d="M400 250 Q430 350 400 450 Q370 350 400 250" fill="#dc2626" filter="url(#glow-t30)"/>
      <circle cx="410" cy="350" r="5" fill="#fff" opacity="0.6"/>
      <path d="M400 0 L400 200" stroke="#9ca3af" stroke-width="8"/>
      <path d="M400 200 L390 220 L410 220 Z" fill="#9ca3af"/>
    `,
    overlay: GRIDS.standard
  },
  't35': { // Illuminati
    bgGradient: ['#0f172a', '#334155'],
    accentColor: '#facc15',
    shapes: `
      <path d="M100 500 L400 50 L700 500 Z" fill="none" stroke="#facc15" stroke-width="5" filter="url(#glow-t35)"/>
      <path d="M100 500 L400 50 L700 500 Z" fill="#facc15" opacity="0.1"/>
      <path d="M250 350 Q400 200 550 350 Q400 500 250 350" fill="#000" stroke="#facc15" stroke-width="2"/>
      <circle cx="400" cy="350" r="40" fill="#facc15"/>
      <circle cx="100" cy="500" r="10" fill="#fff"/>
      <circle cx="700" cy="500" r="10" fill="#fff"/>
      <circle cx="400" cy="50" r="10" fill="#fff"/>
      <line x1="400" y1="350" x2="100" y2="500" stroke="#facc15" stroke-width="1" opacity="0.5"/>
      <line x1="400" y1="350" x2="700" y2="500" stroke="#facc15" stroke-width="1" opacity="0.5"/>
      <line x1="400" y1="350" x2="400" y2="50" stroke="#facc15" stroke-width="1" opacity="0.5"/>
    `,
    overlay: GRIDS.hex
  },
  't43': { // Bilderberger
    bgGradient: ['#1e3a8a', '#172554'],
    accentColor: '#fbbf24',
    shapes: `
      <ellipse cx="400" cy="400" rx="300" ry="100" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
      <circle cx="100" cy="400" r="20" fill="#000"/>
      <circle cx="700" cy="400" r="20" fill="#000"/>
      <circle cx="400" cy="520" r="20" fill="#000"/>
      <circle cx="400" cy="280" r="20" fill="#000"/>
      <rect x="350" y="100" width="100" height="150" fill="#000" stroke="#fbbf24" stroke-width="2"/>
      <circle cx="430" cy="175" r="5" fill="#fbbf24"/>
      <line x1="300" y1="300" x2="500" y2="500" stroke="#ef4444" stroke-width="2" opacity="0.3"/>
    `,
    overlay: GRIDS.waves
  },
  't46': { // Bohemian Grove
    bgGradient: ['#022c22', '#3f0c0c'],
    accentColor: '#f97316',
    shapes: `
      <path d="M0 600 L100 300 L200 600 Z" fill="#064e3b"/>
      <path d="M600 600 L700 300 L800 600 Z" fill="#064e3b"/>
      <path d="M-50 600 L50 350 L150 600 Z" fill="#065f46" opacity="0.7"/>
      <path d="M650 600 L750 350 L850 600 Z" fill="#065f46" opacity="0.7"/>
      <path d="M300 550 L300 250 Q320 150 400 200 Q480 150 500 250 L500 550 Z" fill="#1c1917" stroke="#44403c" stroke-width="2"/>
      <circle cx="360" cy="280" r="15" fill="#f97316" filter="url(#glow-t46)"/>
      <circle cx="440" cy="280" r="15" fill="#f97316" filter="url(#glow-t46)"/>
      <path d="M390 320 L410 320 L400 350 Z" fill="#44403c"/>
      <path d="M350 550 Q400 400 450 550" fill="#ef4444" opacity="0.8" filter="url(#glow-t46)">
         <animate attributeName="d" values="M350 550 Q400 400 450 550;M350 550 Q380 350 450 550;M350 550 Q420 380 450 550" dur="0.5s" repeatCount="indefinite"/>
      </path>
      <circle cx="400" cy="500" r="40" fill="url(#grad-radial-white)" opacity="0.3"/>
      <path d="M380 580 L400 520 L420 580" fill="#000"/>
    `,
    overlay: GRIDS.dots
  },

  // --- BATCH 5 (GEO/ESOTERIC) ---
  't47': { // Transhumanism
    bgGradient: ['#0f172a', '#06b6d4'],
    accentColor: '#22d3ee',
    shapes: `
      <path d="M200 600 L200 300 Q200 100 400 100 Q600 100 600 300 L600 600" fill="#1e293b" opacity="0.8"/>
      <clipPath id="clip-t47">
         <rect x="400" y="0" width="400" height="600" />
      </clipPath>
      <g clip-path="url(#clip-t47)">
         <path d="M200 600 L200 300 Q200 100 400 100 Q600 100 600 300 L600 600" fill="none" stroke="#22d3ee" stroke-width="2"/>
         <polyline points="400 150 450 150 480 200 550 200" fill="none" stroke="#22d3ee" stroke-width="2" filter="url(#glow-t47)"/>
         <circle cx="550" cy="200" r="4" fill="#22d3ee"/>
         <polyline points="420 300 480 300 500 350 580 350" fill="none" stroke="#22d3ee" stroke-width="2" filter="url(#glow-t47)"/>
         <circle cx="580" cy="350" r="4" fill="#22d3ee"/>
         <polyline points="410 450 460 450 460 550" fill="none" stroke="#22d3ee" stroke-width="2" opacity="0.5"/>
      </g>
      <line x1="400" y1="100" x2="400" y2="600" stroke="#22d3ee" stroke-width="1" stroke-dasharray="2 2"/>
      <circle cx="480" cy="250" r="15" fill="none" stroke="#22d3ee" stroke-width="2"/>
      <circle cx="480" cy="250" r="5" fill="#22d3ee" filter="url(#glow-t47)"/>
    `,
    overlay: GRIDS.hex
  },
  't3': { // Reptilians
    bgGradient: ['#022c22', '#365314'],
    accentColor: '#84cc16',
    shapes: `
      <path d="M0 0 L800 0 L800 600 L0 600 Z" fill="url(#p-hex)" opacity="0.2"/>
      <path d="M200 300 Q400 100 600 300 Q400 500 200 300 Z" fill="#000" stroke="#84cc16" stroke-width="4"/>
      <circle cx="400" cy="300" r="90" fill="#facc15" filter="url(#glow-t3)"/>
      <ellipse cx="400" cy="300" rx="10" ry="85" fill="#000"/>
      <path d="M100 100 Q400 150 700 100 L750 0 L50 0 Z" fill="#fca5a5" opacity="0.3"/>
      <path d="M100 500 Q400 450 700 500 L750 600 L50 600 Z" fill="#fca5a5" opacity="0.3"/>
    `,
    overlay: GRIDS.hex
  },
  't10': { // Hollow Earth
    bgGradient: ['#1c1917', '#78350f'],
    accentColor: '#fcd34d',
    shapes: `
      <path d="M50 300 A 350 350 0 1 1 750 300" fill="none" stroke="#57534e" stroke-width="40"/>
      <path d="M50 300 A 350 350 0 0 0 750 300" fill="none" stroke="#57534e" stroke-width="40"/>
      <circle cx="400" cy="300" r="280" fill="url(#grad-radial-white)" opacity="0.1"/>
      <circle cx="400" cy="300" r="60" fill="#fcd34d" filter="url(#glow-t10)">
         <animate attributeName="r" values="60;65;60" dur="4s" repeatCount="indefinite"/>
      </circle>
      <path d="M380 0 L420 0 L400 60 Z" fill="#e0f2fe" opacity="0.8" filter="url(#glow-t10)"/>
      <path d="M380 600 L420 600 L400 540 Z" fill="#e0f2fe" opacity="0.8" filter="url(#glow-t10)"/>
      <path d="M300 200 Q350 250 300 300" fill="none" stroke="#22c55e" stroke-width="5" opacity="0.6"/>
      <path d="M500 400 Q450 350 500 300" fill="none" stroke="#22c55e" stroke-width="5" opacity="0.6"/>
    `,
    overlay: GRIDS.waves
  },
  't15': { // Remote Viewing
    bgGradient: ['#312e81', '#000000'],
    accentColor: '#a855f7',
    shapes: `
      <rect x="100" y="350" width="200" height="150" fill="none" stroke="#4b5563" stroke-width="1" stroke-dasharray="4 2"/>
      <line x1="150" y1="350" x2="150" y2="500" stroke="#4b5563" stroke-width="1"/>
      <line x1="200" y1="350" x2="200" y2="500" stroke="#4b5563" stroke-width="1"/>
      <line x1="250" y1="350" x2="250" y2="500" stroke="#4b5563" stroke-width="1"/>
      <line x1="100" y1="400" x2="300" y2="400" stroke="#4b5563" stroke-width="1"/>
      <line x1="100" y1="450" x2="300" y2="450" stroke="#4b5563" stroke-width="1"/>
      <circle cx="200" cy="425" r="5" fill="#ef4444"/>
      <circle cx="200" cy="425" r="15" fill="none" stroke="#ef4444" stroke-width="1"/>
      <path d="M550 200 Q650 100 750 200 Q650 300 550 200 Z" fill="none" stroke="#a855f7" stroke-width="3"/>
      <circle cx="650" cy="200" r="30" fill="#a855f7" filter="url(#glow-t15)"/>
      <path d="M650 200 L300 350 L100 500 L620 230" fill="url(#viewBeam)"/>
      <text x="500" y="50" font-family="monospace" font-size="12" fill="#a855f7">COORD: 37.2431° N</text>
      <text x="500" y="70" font-family="monospace" font-size="12" fill="#a855f7">TARGET: CONFIRMED</text>
    `,
    overlay: GRIDS.polar
  },
  't22': { // Simulation Theory
    bgGradient: ['#000000', '#022c22'],
    accentColor: '#22c55e',
    shapes: `
      <path d="M0 400 L800 400 M100 400 L-100 600 M200 400 L100 600 M300 400 L300 600 M400 400 L500 600 M500 400 L700 600 M600 400 L900 600" stroke="#22c55e" stroke-width="1" opacity="0.5"/>
      <line x1="0" y1="450" x2="800" y2="450" stroke="#22c55e" stroke-width="1" opacity="0.4"/>
      <line x1="0" y1="520" x2="800" y2="520" stroke="#22c55e" stroke-width="1" opacity="0.6"/>
      <rect x="350" y="200" width="100" height="100" fill="none" stroke="#22c55e" stroke-width="4" filter="url(#glow-t22)"/>
      <rect x="370" y="180" width="100" height="100" fill="none" stroke="#22c55e" stroke-width="1" opacity="0.5"/>
      <text x="100" y="100" font-family="monospace" font-size="14" fill="#22c55e" opacity="0.8">0 1 0 1</text>
      <text x="100" y="120" font-family="monospace" font-size="14" fill="#22c55e" opacity="0.6">1 0 1 0</text>
      <text x="100" y="140" font-family="monospace" font-size="14" fill="#22c55e" opacity="0.4">0 0 1 1</text>
      <text x="650" y="200" font-family="monospace" font-size="14" fill="#22c55e" opacity="0.8">E R R O R</text>
      <rect x="640" y="185" width="80" height="20" fill="#22c55e" opacity="0.2"/>
    `,
    overlay: GRIDS.standard
  },
  't28': { // Planet Nibiru
    bgGradient: ['#000000', '#450a0a'],
    accentColor: '#ef4444',
    shapes: `
      <circle cx="100" cy="100" r="1" fill="white"/>
      <circle cx="500" cy="500" r="1" fill="white"/>
      <circle cx="100" cy="500" r="40" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="600" cy="200" r="180" fill="url(#grad-radial-purple)" stroke="#b91c1c" stroke-width="2"/>
      <circle cx="600" cy="200" r="170" fill="#7f1d1d" opacity="0.8"/>
      <path d="M400 200 Q500 100 600 50" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="10 10" opacity="0.6" filter="url(#glow-t28)"/>
      <path d="M400 200 Q500 300 600 350" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="10 10" opacity="0.6" filter="url(#glow-t28)"/>
      <circle cx="450" cy="250" r="3" fill="#b91c1c"/>
      <circle cx="480" cy="180" r="5" fill="#b91c1c"/>
      <circle cx="500" cy="220" r="2" fill="#b91c1c"/>
    `,
    overlay: GRIDS.dots
  },
  't38': { // Nordics
    bgGradient: ['#1e40af', '#e0f2fe'],
    accentColor: '#f0f9ff',
    shapes: `
      <g filter="url(#glow-t38)">
        <circle cx="100" cy="100" r="4" fill="white"/>
        <circle cx="120" cy="130" r="3" fill="white"/>
        <circle cx="140" cy="110" r="5" fill="white"/>
        <circle cx="150" cy="90" r="3" fill="white"/>
        <circle cx="110" cy="80" r="4" fill="white"/>
        <circle cx="130" cy="70" r="2" fill="white"/>
        <circle cx="160" cy="120" r="3" fill="white"/>
      </g>
      <path d="M400 150 Q430 150 430 190 Q430 220 450 250 L480 400 L500 550 L300 550 L320 400 L350 250 Q370 220 370 190 Q370 150 400 150" fill="url(#beingGrad)" filter="url(#glow-t38)"/>
      <ellipse cx="400" cy="130" rx="40" ry="10" fill="none" stroke="#f0f9ff" stroke-width="2" opacity="0.6"/>
      <line x1="400" y1="150" x2="400" y2="50" stroke="white" stroke-width="2" opacity="0.3"/>
      <line x1="400" y1="150" x2="300" y2="100" stroke="white" stroke-width="2" opacity="0.3"/>
      <line x1="400" y1="150" x2="500" y2="100" stroke="white" stroke-width="2" opacity="0.3"/>
    `,
    overlay: GRIDS.waves
  },
  't39': { // Aldebaran
    bgGradient: ['#2e1065', '#000000'],
    accentColor: '#d8b4fe',
    shapes: `
      <g transform="translate(400,300)" stroke="#4c1d95" stroke-width="4">
         <circle r="50" fill="#000"/>
         <path d="M0 -50 L0 -100 M35 -35 L70 -70 M50 0 L100 0 M35 35 L70 70 M0 50 L0 100 M-35 35 L-70 70 M-50 0 L-100 0 M-35 -35 L-70 -70" />
         <path d="M0 -100 L10 -80 M70 -70 L60 -50" stroke-width="2"/>
      </g>
      <path d="M400 300 Q500 200 600 100" fill="none" stroke="#d8b4fe" stroke-width="2" filter="url(#glow-t39)">
         <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M400 300 Q300 400 200 500" fill="none" stroke="#d8b4fe" stroke-width="2" filter="url(#glow-t39)"/>
      <ellipse cx="400" cy="500" rx="150" ry="30" fill="none" stroke="#a855f7" stroke-width="1" stroke-dasharray="5 5"/>
      <path d="M350 500 L400 450 L450 500" fill="none" stroke="#a855f7" stroke-width="1"/>
    `,
    overlay: GRIDS.hex
  },
  't40': { // Draconians
    bgGradient: ['#450a0a', '#171717'],
    accentColor: '#dc2626',
    shapes: `
      <path d="M0 0 L200 200 L400 0 Z" fill="#1f2937" opacity="0.5"/>
      <path d="M800 0 L600 200 L400 0 Z" fill="#1f2937" opacity="0.5"/>
      <path d="M250 250 Q400 150 550 250 Q400 450 250 250" fill="#000" stroke="#dc2626" stroke-width="5"/>
      <path d="M400 150 L400 450" stroke="#dc2626" stroke-width="15" filter="url(#glow-t40)">
         <animate attributeName="stroke-width" values="15;10;15" dur="3s" repeatCount="indefinite"/>
      </path>
      <path d="M100 500 L150 400 L200 500" fill="#7f1d1d"/>
      <path d="M600 500 L650 400 L700 500" fill="#7f1d1d"/>
      <path d="M100 100 L150 120 L100 140 Z" fill="#dc2626" opacity="0.6"/>
      <path d="M700 100 L650 120 L700 140 Z" fill="#dc2626" opacity="0.6"/>
    `,
    overlay: GRIDS.hex
  },
  't57': { // Akasha
    bgGradient: ['#fff7ed', '#fef3c7'],
    accentColor: '#d97706',
    shapes: `
      <rect x="50" y="0" width="40" height="600" fill="#fde68a" opacity="0.5"/>
      <rect x="710" y="0" width="40" height="600" fill="#fde68a" opacity="0.5"/>
      <g stroke="#d97706" stroke-width="1" opacity="0.6">
         <circle cx="200" cy="200" r="5" fill="#d97706"/>
         <circle cx="400" cy="150" r="8" fill="#d97706"/>
         <circle cx="600" cy="250" r="5" fill="#d97706"/>
         <line x1="200" y1="200" x2="400" y2="150"/>
         <line x1="400" y1="150" x2="600" y2="250"/>
         <line x1="200" y1="200" x2="300" y2="400"/>
         <line x1="300" y1="400" x2="500" y2="350"/>
         <line x1="500" y1="350" x2="600" y2="250"/>
      </g>
      <path d="M350 300 Q400 320 450 300 Q450 350 450 400 Q400 420 350 400 Q350 350 350 300" fill="none" stroke="#d97706" stroke-width="3" filter="url(#glow-t57)"/>
      <line x1="400" y1="310" x2="400" y2="410" stroke="#d97706" stroke-width="1"/>
    `,
    overlay: GRIDS.waves
  },

  // --- BATCH 6 (HISTORICAL) ---
  't4': { // Moon Landing
    bgGradient: ['#000000', '#1f2937'],
    accentColor: '#ffffff',
    shapes: `
      <path d="M0 450 Q200 400 400 450 Q600 500 800 450 L800 600 L0 600 Z" fill="#374151" stroke="#4b5563" stroke-width="2"/>
      <ellipse cx="200" cy="500" rx="50" ry="10" fill="#1f2937"/>
      <ellipse cx="600" cy="550" rx="80" ry="20" fill="#1f2937"/>
      <path d="M400 0 L100 600 L700 600 Z" fill="url(#grad-radial-white)" opacity="0.1"/>
      <path d="M380 0 L420 0 L450 50 L350 50 Z" fill="#d1d5db"/>
      <rect x="0" y="0" width="50" height="600" fill="#000"/>
      <rect x="750" y="0" width="50" height="600" fill="#000"/>
      <rect x="10" y="20" width="30" height="40" fill="#fff" rx="5"/>
      <rect x="10" y="100" width="30" height="40" fill="#fff" rx="5"/>
      <rect x="10" y="180" width="30" height="40" fill="#fff" rx="5"/>
      <rect x="760" y="20" width="30" height="40" fill="#fff" rx="5"/>
      <line x1="500" y1="450" x2="500" y2="300" stroke="#fff" stroke-width="3"/>
      <path d="M500 300 L600 300 L600 350 L500 350" fill="#fff" opacity="0.8"/>
      <line x1="500" y1="300" x2="600" y2="300" stroke="#9ca3af" stroke-width="2"/>
    `,
    overlay: GRIDS.dots
  },
  't16': { // JFK
    bgGradient: ['#1e3a8a', '#991b1b'],
    accentColor: '#ef4444',
    shapes: `
      <path d="M200 500 L600 500 L600 450 L500 450 L450 400 L250 400 L200 450 Z" fill="#000"/>
      <circle cx="250" cy="500" r="30" fill="#333"/>
      <circle cx="550" cy="500" r="30" fill="#333"/>
      <path d="M700 100 L500 300 L450 250 L400 420" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="10 5" filter="url(#glow-t16)"/>
      <circle cx="700" cy="100" r="5" fill="#ef4444"/>
      <circle cx="400" cy="300" r="250" fill="none" stroke="#000" stroke-width="1" opacity="0.3"/>
      <line x1="400" y1="50" x2="400" y2="550" stroke="#000" stroke-width="1" opacity="0.3"/>
      <line x1="150" y1="300" x2="650" y2="300" stroke="#000" stroke-width="1" opacity="0.3"/>
    `,
    overlay: GRIDS.standard
  },
  't24': { // Titanic
    bgGradient: ['#082f49', '#0f172a'],
    accentColor: '#38bdf8',
    shapes: `
      <path d="M100 400 L700 400 L650 550 L150 550 Z" fill="#000"/>
      <rect x="250" y="300" width="40" height="100" fill="#000"/>
      <rect x="350" y="300" width="40" height="100" fill="#000"/>
      <rect x="450" y="300" width="40" height="100" fill="#000"/>
      <rect x="550" y="300" width="40" height="100" fill="#000"/>
      <rect x="0" y="500" width="800" height="100" fill="#082f49" opacity="0.8"/>
      <path d="M150 550 L650 550 L700 650 L100 650 Z" fill="#000" opacity="0.2"/>
      <path d="M600 600 L700 350 L800 600" fill="#e0f2fe" opacity="0.1"/> 
      <path d="M650 600 L700 450 L750 600" fill="#fff" opacity="0.5"/>
      <text x="350" y="450" font-family="monospace" font-size="20" fill="#fff" opacity="0.5" transform="scale(1, -1) translate(0, -900)">OLYMPIC?</text>
    `,
    overlay: GRIDS.waves
  },
  't26': { // Phantom Time
    bgGradient: ['#451a03', '#78350f'],
    accentColor: '#fbbf24',
    shapes: `
      <circle cx="400" cy="300" r="200" fill="none" stroke="#78350f" stroke-width="5"/>
      <path d="M400 300 L400 100" stroke="#000" stroke-width="4"/>
      <path d="M400 300 L550 300" stroke="#000" stroke-width="4"/>
      <path d="M400 300 L300 473" stroke="#ef4444" stroke-width="2" stroke-dasharray="5 5"/>
      <path d="M400 300 L226 200" stroke="#ef4444" stroke-width="2" stroke-dasharray="5 5"/>
      <path d="M400 300 L300 473 A 200 200 0 0 1 226 200 Z" fill="#000" opacity="0.2"/>
      <text x="390" y="80" font-family="serif" font-size="24" fill="#000">XII</text>
      <text x="610" y="310" font-family="serif" font-size="24" fill="#000">III</text>
      <text x="390" y="540" font-family="serif" font-size="24" fill="#000">VI</text>
      <text x="170" y="310" font-family="serif" font-size="24" fill="#000">IX</text>
      <rect x="550" y="450" width="60" height="80" fill="#fff" stroke="#000"/>
      <text x="560" y="490" font-family="serif" font-size="20">614</text>
      <line x1="550" y1="450" x2="610" y2="530" stroke="#ef4444" stroke-width="2"/>
    `,
    overlay: GRIDS.standard
  },
  't34': { // Freemasons
    bgGradient: ['#172554', '#1e3a8a'],
    accentColor: '#facc15',
    shapes: `
      <rect x="0" y="450" width="800" height="150" fill="url(#p-checkers)" transform="perspective(500px) rotateX(45deg)"/>
      <g transform="translate(400,250) scale(1.5)">
         <path d="M0 -80 L-40 40 M0 -80 L40 40" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
         <circle cx="0" cy="-80" r="5" fill="#facc15"/>
         <path d="M-40 0 L0 40 L40 0" fill="none" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
         <text x="0" y="10" text-anchor="middle" font-family="serif" font-size="40" font-weight="bold" fill="#facc15">G</text>
      </g>
      <rect x="100" y="100" width="40" height="400" fill="#94a3b8"/>
      <rect x="660" y="100" width="40" height="400" fill="#94a3b8"/>
      <circle cx="120" cy="80" r="20" fill="#cbd5e1"/>
      <circle cx="680" cy="80" r="20" fill="#cbd5e1"/>
    `,
    overlay: GRIDS.hex
  },
  't36': { // Jesuits
    bgGradient: ['#000000', '#7f1d1d'],
    accentColor: '#fca5a5',
    shapes: `
      <path d="M400 300 L400 50 M400 300 L400 550 M400 300 L650 300 M400 300 L150 300" stroke="#7f1d1d" stroke-width="2" opacity="0.5"/>
      <path d="M400 300 L580 120 M400 300 L220 480 M400 300 L580 480 M400 300 L220 120" stroke="#7f1d1d" stroke-width="2" opacity="0.5"/>
      <circle cx="400" cy="300" r="120" fill="#000" stroke="#dc2626" stroke-width="2"/>
      <text x="400" y="320" text-anchor="middle" font-family="serif" font-size="60" font-weight="bold" fill="#dc2626">IHS</text>
      <path d="M400 260 L400 220 M380 240 L420 240" stroke="#dc2626" stroke-width="4"/>
      <path d="M100 600 L200 400 L300 600 Z" fill="#000" opacity="0.8"/>
      <path d="M500 600 L600 400 L700 600 Z" fill="#000" opacity="0.8"/>
      <circle cx="400" cy="300" r="280" fill="none" stroke="#450a0a" stroke-width="1" stroke-dasharray="5 5"/>
    `,
    overlay: GRIDS.standard
  },
  't45': { // Skull & Bones
    bgGradient: ['#000000', '#1c1917'],
    accentColor: '#e5e5e5',
    shapes: `
      <line x1="200" y1="200" x2="600" y2="400" stroke="#e5e5e5" stroke-width="30" stroke-linecap="round"/>
      <line x1="600" y1="200" x2="200" y2="400" stroke="#e5e5e5" stroke-width="30" stroke-linecap="round"/>
      <path d="M300 200 Q400 100 500 200 L500 300 Q500 350 450 380 L350 380 Q300 350 300 300 Z" fill="#e5e5e5"/>
      <circle cx="360" cy="250" r="30" fill="#000"/>
      <circle cx="440" cy="250" r="30" fill="#000"/>
      <path d="M390 300 L400 280 L410 300 Z" fill="#000"/>
      <text x="400" y="450" text-anchor="middle" font-family="serif" font-size="60" font-weight="bold" fill="#e5e5e5">322</text>
      <rect x="350" y="80" width="100" height="80" fill="#000" stroke="#333" stroke-width="2"/>
      <rect x="320" y="160" width="160" height="20" fill="#000" stroke="#333" stroke-width="2"/>
    `,
    overlay: GRIDS.standard
  },
  't49': { // Tartaria
    bgGradient: ['#fef3c7', '#d6d3d1'],
    accentColor: '#b45309',
    shapes: `
      <path d="M200 300 Q250 150 300 300" fill="#fde68a" stroke="#78350f" stroke-width="2"/>
      <path d="M500 300 Q550 150 600 300" fill="#fde68a" stroke="#78350f" stroke-width="2"/>
      <rect x="220" y="300" width="60" height="200" fill="#fde68a" stroke="#78350f"/>
      <rect x="520" y="300" width="60" height="200" fill="#fde68a" stroke="#78350f"/>
      <rect x="300" y="250" width="200" height="250" fill="#fff7ed" stroke="#78350f"/>
      <rect x="320" y="280" width="30" height="60" fill="#000" opacity="0.6"/>
      <rect x="380" y="280" width="30" height="60" fill="#000" opacity="0.6"/>
      <rect x="440" y="280" width="30" height="60" fill="#000" opacity="0.6"/>
      <rect x="320" y="400" width="30" height="60" fill="#000" opacity="0.6"/>
      <rect x="380" y="400" width="30" height="60" fill="#000" opacity="0.6"/>
      <rect x="440" y="400" width="30" height="60" fill="#000" opacity="0.6"/>
      <path d="M0 600 L0 450 Q200 430 400 460 Q600 490 800 450 L800 600 Z" fill="#b45309" opacity="0.9"/>
      <path d="M0 600 L0 500 Q400 480 800 500 L800 600 Z" fill="#78350f" opacity="0.8"/>
    `,
    overlay: GRIDS.dots
  },
  't53': { // Piri Reis
    bgGradient: ['#f5f5f4', '#d6d3d1'],
    accentColor: '#78350f',
    shapes: `
      <path d="M200 100 Q150 200 250 300 Q150 400 300 500 L600 550 Q700 500 650 400" fill="none" stroke="#78350f" stroke-width="3" filter="url(#glow-t53)"/>
      <circle cx="500" cy="200" r="40" fill="none" stroke="#b91c1c" stroke-width="1"/>
      <path d="M500 160 L500 240 M460 200 L540 200" stroke="#b91c1c" stroke-width="1"/>
      <circle cx="200" cy="400" r="30" fill="none" stroke="#b91c1c" stroke-width="1"/>
      <line x1="500" y1="200" x2="200" y2="400" stroke="#78350f" stroke-width="1" opacity="0.3"/>
      <path d="M300 200 L320 200 L310 220 Z" fill="#000"/>
      <path d="M550 450 L570 450 L560 470 Z" fill="#000"/>
      <path d="M600 100 Q610 90 620 100 T640 100" stroke="#000" fill="none"/>
      <path d="M600 120 Q610 110 620 120 T640 120" stroke="#000" fill="none"/>
    `,
    overlay: GRIDS.standard
  },
  't54': { // Templars
    bgGradient: ['#fff', '#e5e5e5'],
    accentColor: '#dc2626',
    shapes: `
      <path d="M350 150 L450 150 L500 50 L300 50 Z" fill="#dc2626"/>
      <path d="M350 450 L450 450 L500 550 L300 550 Z" fill="#dc2626"/>
      <path d="M150 250 L150 350 L50 400 L50 200 Z" fill="#dc2626"/>
      <path d="M650 250 L650 350 L750 400 L750 200 Z" fill="#dc2626"/>
      <rect x="350" y="250" width="100" height="100" fill="#dc2626"/>
      <rect x="390" y="100" width="20" height="400" fill="#9ca3af" stroke="#4b5563"/>
      <rect x="350" y="150" width="100" height="20" fill="#4b5563"/>
      <path d="M350 400 Q400 400 450 400 L430 500 L370 500 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2" opacity="0.8"/>
      <circle cx="400" cy="380" r="10" fill="#fff" filter="url(#glow-t54)"/>
    `,
    overlay: GRIDS.checkers
  },

  // --- BATCH 7 (HEALTH & MODERN MYTHS) ---
  't29': { // Fluoride
    bgGradient: ['#0891b2', '#06b6d4'], // Water Blue/Teal
    accentColor: '#a5f3fc',
    shapes: `
      <!-- Brain Outline -->
      <path d="M300 300 Q300 100 500 100 Q700 100 700 300 Q700 500 500 500 Q300 500 300 300" fill="none" stroke="#fff" stroke-width="2" opacity="0.3"/>
      
      <!-- Pineal Gland (Third Eye) -->
      <path d="M480 300 Q500 280 520 300 Q500 320 480 300" fill="#fff" filter="url(#glow-t29)"/>
      <!-- Calcification (Crystal) -->
      <path d="M495 295 L505 295 L500 305 Z" fill="#94a3b8"/>
      
      <!-- Water Drop -->
      <path d="M500 150 Q480 200 480 230 A 20 20 0 1 0 520 230 Q520 200 500 150" fill="#cffafe" stroke="#22d3ee" stroke-width="2"/>
      
      <!-- Tap Faucet Outline (Abstract) -->
      <path d="M100 200 L300 200 L300 250" fill="none" stroke="#cbd5e1" stroke-width="10"/>
      <path d="M300 250 L300 400" stroke="#06b6d4" stroke-width="4" stroke-dasharray="10 5"/>
    `,
    overlay: GRIDS.waves
  },
  't48': { // Plandemie
    bgGradient: ['#022c22', '#000000'], // Biohazard Green/Black
    accentColor: '#ef4444', // Alert Red
    shapes: `
      <!-- Virus Structure -->
      <circle cx="400" cy="300" r="100" fill="#14532d" stroke="#16a34a" stroke-width="4"/>
      <!-- Spikes -->
      <line x1="400" y1="200" x2="400" y2="150" stroke="#16a34a" stroke-width="5"/>
      <line x1="400" y1="400" x2="400" y2="450" stroke="#16a34a" stroke-width="5"/>
      <line x1="300" y1="300" x2="250" y2="300" stroke="#16a34a" stroke-width="5"/>
      <line x1="500" y1="300" x2="550" y2="300" stroke="#16a34a" stroke-width="5"/>
      <!-- Diagonals -->
      <line x1="330" y1="230" x2="290" y2="190" stroke="#16a34a" stroke-width="5"/>
      <line x1="470" y1="230" x2="510" y2="190" stroke="#16a34a" stroke-width="5"/>
      <line x1="330" y1="370" x2="290" y2="410" stroke="#16a34a" stroke-width="5"/>
      <line x1="470" y1="370" x2="510" y2="410" stroke="#16a34a" stroke-width="5"/>
      
      <!-- Target Scope -->
      <circle cx="400" cy="300" r="200" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="20 10"/>
      <line x1="400" y1="50" x2="400" y2="550" stroke="#ef4444" stroke-width="1" opacity="0.5"/>
      <line x1="150" y1="300" x2="650" y2="300" stroke="#ef4444" stroke-width="1" opacity="0.5"/>
      
      <!-- Syringe -->
      <rect x="600" y="100" width="20" height="100" fill="#fff" transform="rotate(45 600 100)"/>
      <line x1="580" y1="120" x2="550" y2="150" stroke="#94a3b8" stroke-width="2"/>
      
      <!-- QR Code Fragment -->
      <rect x="50" y="500" width="100" height="100" fill="url(#p-checkers)"/>
    `,
    overlay: GRIDS.hex
  },
  't8': { // Bielefeld
    bgGradient: ['#3f3f46', '#18181b'], // Static Grey
    accentColor: '#a1a1aa',
    shapes: `
      <!-- Map Outline -->
      <path d="M100 100 L700 100 L700 500 L100 500 Z" fill="none" stroke="#52525b" stroke-width="4"/>
      
      <!-- Roads -->
      <line x1="100" y1="200" x2="700" y2="200" stroke="#52525b" stroke-width="2"/>
      <line x1="100" y1="400" x2="700" y2="400" stroke="#52525b" stroke-width="2"/>
      <line x1="300" y1="100" x2="300" y2="500" stroke="#52525b" stroke-width="2"/>
      <line x1="500" y1="100" x2="500" y2="500" stroke="#52525b" stroke-width="2"/>
      
      <!-- The Void (Glitch Center) -->
      <rect x="250" y="150" width="300" height="300" fill="#18181b"/>
      <text x="400" y="300" font-family="monospace" font-size="20" fill="#a1a1aa" text-anchor="middle">404 NOT FOUND</text>
      
      <!-- Static Noise -->
      <rect x="250" y="150" width="300" height="300" fill="url(#p-dots)" opacity="0.5"/>
      <line x1="250" y1="150" x2="550" y2="450" stroke="#000" stroke-width="1"/>
      <line x1="550" y1="150" x2="250" y2="450" stroke="#000" stroke-width="1"/>
    `,
    overlay: GRIDS.standard
  },
  't13': { // MJ-12
    bgGradient: ['#000000', '#1c1917'],
    accentColor: '#000', // Black Ink
    shapes: `
      <!-- Document Page -->
      <rect x="150" y="50" width="500" height="500" fill="#e5e5e5"/>
      
      <!-- Text Lines -->
      <line x1="200" y1="100" x2="600" y2="100" stroke="#000" stroke-width="2"/>
      <line x1="200" y1="130" x2="600" y2="130" stroke="#000" stroke-width="2"/>
      <line x1="200" y1="160" x2="600" y2="160" stroke="#000" stroke-width="2"/>
      
      <!-- Redactions -->
      <rect x="220" y="90" width="100" height="20" fill="#000"/>
      <rect x="400" y="120" width="150" height="20" fill="#000"/>
      <rect x="250" y="150" width="200" height="20" fill="#000"/>
      
      <!-- TOP SECRET Stamp -->
      <rect x="350" y="300" width="200" height="60" fill="none" stroke="#ef4444" stroke-width="4" transform="rotate(-15 450 330)"/>
      <text x="450" y="340" font-family="stencil" font-size="40" fill="#ef4444" text-anchor="middle" transform="rotate(-15 450 330)" opacity="0.8">TOP SECRET</text>
      
      <!-- MJ-12 Logo (Abstract) -->
      <circle cx="250" cy="450" r="30" fill="none" stroke="#000" stroke-width="2"/>
      <text x="250" y="455" font-family="serif" font-size="14" text-anchor="middle">MJ-12</text>
    `,
    overlay: GRIDS.standard
  },
  't17': { // Roswell
    bgGradient: ['#7c2d12', '#0f172a'], // Desert to Night Sky
    accentColor: '#fbbf24', // Crash Fire
    shapes: `
      <!-- Sand Dunes -->
      <path d="M0 400 Q200 350 400 400 Q600 450 800 400 L800 600 L0 600 Z" fill="#9a3412"/>
      <path d="M0 500 Q400 450 800 500 L800 600 L0 600 Z" fill="#7c2d12"/>
      
      <!-- Saucer Wreckage -->
      <ellipse cx="500" cy="380" rx="100" ry="30" fill="#334155" transform="rotate(-20 500 380)"/>
      <path d="M450 350 L550 410" stroke="#000" stroke-width="2"/> <!-- Crack -->
      
      <!-- Smoke -->
      <circle cx="520" cy="350" r="20" fill="#57534e" opacity="0.6"/>
      <circle cx="540" cy="330" r="30" fill="#44403c" opacity="0.5"/>
      <circle cx="560" cy="300" r="40" fill="#292524" opacity="0.4"/>
      
      <!-- Alien Hand (Silhouette) -->
      <path d="M300 550 L310 500 L320 550 M310 500 L330 510" stroke="#a3e635" stroke-width="2" opacity="0.8"/>
      
      <!-- Radar Waves -->
      <path d="M100 100 A 50 50 0 0 1 150 150" fill="none" stroke="#22c55e" stroke-width="2"/>
      <path d="M80 80 A 80 80 0 0 1 160 160" fill="none" stroke="#22c55e" stroke-width="2"/>
    `,
    overlay: GRIDS.dots
  },
  't23': { // Birds Aren't Real
    bgGradient: ['#bae6fd', '#f1f5f9'], // Sky
    accentColor: '#38bdf8',
    shapes: `
      <!-- Bird Body -->
      <path d="M300 300 Q350 200 450 250 L550 220 L500 300 Q450 350 300 300" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      
      <!-- Wings (Circuit Board Texture) -->
      <path d="M350 250 L200 150 L300 280" fill="#94a3b8"/>
      <line x1="250" y1="200" x2="280" y2="220" stroke="#000" stroke-width="1"/>
      <circle cx="250" cy="200" r="2" fill="#000"/>
      
      <!-- Camera Eye -->
      <circle cx="500" cy="250" r="10" fill="#000"/>
      <circle cx="500" cy="250" r="4" fill="#ef4444" filter="url(#glow-t23)">
         <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </circle>
      
      <!-- Antenna -->
      <line x1="450" y1="230" x2="450" y2="180" stroke="#64748b" stroke-width="2"/>
      <circle cx="450" cy="180" r="2" fill="#64748b"/>
      
      <!-- Power Lines -->
      <line x1="0" y1="500" x2="800" y2="500" stroke="#000" stroke-width="2"/>
      <circle cx="200" cy="500" r="5" fill="#000"/> <!-- Feet -->
      <circle cx="220" cy="500" r="5" fill="#000"/>
    `,
    overlay: GRIDS.standard
  },
  't25': { // Denver Airport
    bgGradient: ['#1e3a8a', '#111827'],
    accentColor: '#ef4444',
    shapes: `
      <!-- Blue Mustang Silhouette -->
      <path d="M300 500 L300 300 Q300 200 400 150 Q450 200 450 250 L420 300 L450 500" fill="#1d4ed8"/>
      <path d="M400 150 L380 100 L420 100 Z" fill="#1d4ed8"/> <!-- Ears -->
      
      <!-- Glowing Eyes -->
      <circle cx="410" cy="180" r="5" fill="#ef4444" filter="url(#glow-t25)"/>
      
      <!-- Runways (Swastika-like abstract) -->
      <line x1="100" y1="100" x2="700" y2="500" stroke="#fff" stroke-width="10" opacity="0.2"/>
      <line x1="700" y1="100" x2="100" y2="500" stroke="#fff" stroke-width="10" opacity="0.2"/>
      
      <!-- Tent Roofs -->
      <path d="M50 600 L150 400 L250 600" fill="#fff" opacity="0.5"/>
      <path d="M550 600 L650 400 L750 600" fill="#fff" opacity="0.5"/>
    `,
    overlay: GRIDS.hex
  },
  't27': { // Paul is Dead
    bgGradient: ['#fff', '#e5e5e5'],
    accentColor: '#000',
    shapes: `
      <!-- Zebra Crossing -->
      <rect x="100" y="400" width="100" height="200" fill="#000"/>
      <rect x="300" y="400" width="100" height="200" fill="#000"/>
      <rect x="500" y="400" width="100" height="200" fill="#000"/>
      <rect x="700" y="400" width="100" height="200" fill="#000"/>
      
      <!-- Bare Feet -->
      <path d="M320 450 Q330 430 350 450 L350 480 Q330 500 320 480 Z" fill="#000" opacity="0.8"/>
      <path d="M360 500 Q370 480 390 500 L390 530 Q370 550 360 530 Z" fill="#000" opacity="0.8"/>
      
      <!-- VW Beetle License Plate -->
      <rect x="600" y="300" width="80" height="30" fill="#fbbf24" stroke="#000"/>
      <text x="610" y="320" font-family="monospace" font-size="12" fill="#000">28IF</text>
      
      <!-- Walking Figures (Abstract) -->
      <line x1="150" y1="300" x2="150" y2="400" stroke="#000" stroke-width="4"/>
      <line x1="550" y1="300" x2="550" y2="400" stroke="#000" stroke-width="4"/>
      <line x1="750" y1="300" x2="750" y2="400" stroke="#fff" stroke-width="4"/> <!-- Undertaker -->
    `,
    overlay: GRIDS.standard
  },
  't31': { // Bigfoot
    bgGradient: ['#064e3b', '#022c22'], // Deep Forest
    accentColor: '#a16207', // Fur Brown
    shapes: `
      <!-- Trees -->
      <path d="M100 600 L150 100 L200 600" fill="#065f46"/>
      <path d="M600 600 L650 100 L700 600" fill="#065f46"/>
      <path d="M300 600 L400 0 L500 600" fill="#047857" opacity="0.5"/>
      
      <!-- Hairy Silhouette (Blurry) -->
      <path d="M380 400 Q400 350 420 400 L430 550 L370 550 Z" fill="#3f2c22" filter="url(#glow-t31)"/>
      <circle cx="400" cy="360" r="15" fill="#3f2c22" filter="url(#glow-t31)"/>
      
      <!-- Large Footprint -->
      <path d="M500 500 Q550 450 600 500 Q620 550 600 600 Q550 650 500 600 Q480 550 500 500" fill="#000" opacity="0.3" transform="scale(1.5) translate(-100, -100)"/>
      <circle cx="520" cy="460" r="10" fill="#000" opacity="0.3"/> <!-- Toes -->
      <circle cx="550" cy="450" r="10" fill="#000" opacity="0.3"/>
      <circle cx="580" cy="460" r="10" fill="#000" opacity="0.3"/>
    `,
    overlay: GRIDS.dots
  },
  't32': { // Loch Ness
    bgGradient: ['#0f172a', '#0c4a6e'], // Deep Lake
    accentColor: '#38bdf8',
    shapes: `
      <!-- Water Surface -->
      <rect x="0" y="400" width="800" height="200" fill="#082f49" opacity="0.8"/>
      
      <!-- Monster Silhouette -->
      <path d="M200 450 Q250 350 300 450" fill="#000"/> <!-- Hump 1 -->
      <path d="M350 450 Q400 380 450 450" fill="#000"/> <!-- Hump 2 -->
      <path d="M500 450 Q520 200 550 250 Q560 260 550 450" fill="#000"/> <!-- Neck/Head -->
      
      <!-- Ripples -->
      <ellipse cx="250" cy="450" rx="60" ry="10" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.5"/>
      <ellipse cx="400" cy="450" rx="60" ry="10" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.5"/>
      <ellipse cx="530" cy="450" rx="40" ry="5" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.5"/>
      
      <!-- Mist -->
      <path d="M0 350 Q200 300 400 350 T800 350" fill="none" stroke="#fff" stroke-width="20" filter="url(#glow-t32)" opacity="0.2"/>
    `,
    overlay: GRIDS.waves
  },

  // --- BATCH 8 (FINAL MODERN MYTHS) ---
  't33': { // Yeti
    bgGradient: ['#f8fafc', '#cbd5e1'], // Snowstorm White/Grey
    accentColor: '#3b82f6', // Ice Blue
    shapes: `
      <!-- Mountains -->
      <path d="M0 600 L200 200 L400 600" fill="#94a3b8"/>
      <path d="M300 600 L500 100 L700 600" fill="#64748b"/>
      <path d="M600 600 L800 300 L900 600" fill="#475569"/>
      
      <!-- Snow Caps -->
      <path d="M150 300 L200 200 L250 300 L220 320 L200 280 L180 320 Z" fill="#fff"/>
      <path d="M450 200 L500 100 L550 200 L520 220 L500 180 L480 220 Z" fill="#fff"/>
      
      <!-- Blizzard Noise -->
      <rect x="0" y="0" width="800" height="600" fill="url(#p-dots)" opacity="0.5"/>
      
      <!-- Yeti Eyes (Glowing in cave) -->
      <path d="M350 600 Q400 500 450 600" fill="#1e293b"/> <!-- Cave Entrance -->
      <circle cx="390" cy="550" r="3" fill="#3b82f6" filter="url(#glow-t33)"/>
      <circle cx="410" cy="550" r="3" fill="#3b82f6" filter="url(#glow-t33)"/>
      
      <!-- Footprint -->
      <path d="M600 500 Q620 450 650 500 Q680 520 650 550 Q620 580 600 550" fill="#e2e8f0" opacity="0.8"/>
      <circle cx="610" cy="460" r="5" fill="#e2e8f0"/>
      <circle cx="630" cy="455" r="5" fill="#e2e8f0"/>
      <circle cx="650" cy="460" r="5" fill="#e2e8f0"/>
    `,
    overlay: GRIDS.waves
  },
  't37': { // Greys
    bgGradient: ['#000000', '#111827'], // Deep Space
    accentColor: '#10b981', // Alien Green
    shapes: `
      <!-- Head Shape -->
      <path d="M400 100 Q250 150 320 400 Q400 550 480 400 Q550 150 400 100" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
      
      <!-- Large Eyes -->
      <ellipse cx="350" cy="300" rx="35" ry="60" fill="#000" transform="rotate(20 350 300)"/>
      <ellipse cx="450" cy="300" rx="35" ry="60" fill="#000" transform="rotate(-20 450 300)"/>
      
      <!-- Eye Reflections -->
      <circle cx="360" cy="280" r="5" fill="#fff" opacity="0.8"/>
      <circle cx="440" cy="280" r="5" fill="#fff" opacity="0.8"/>
      
      <!-- Beam of Light -->
      <path d="M400 0 L300 600 L500 600 Z" fill="url(#grad-radial-white)" opacity="0.1"/>
      
      <!-- Stars -->
      <circle cx="100" cy="100" r="2" fill="#fff"/>
      <circle cx="700" cy="500" r="2" fill="#fff"/>
      <circle cx="50" cy="300" r="1" fill="#fff"/>
      <circle cx="750" cy="100" r="2" fill="#fff"/>
    `,
    overlay: GRIDS.standard
  },
  't41': { // Men In Black
    bgGradient: ['#0f172a', '#000000'], // Night City
    accentColor: '#38bdf8', // Neuralyzer Flash
    shapes: `
      <!-- Street Light Cone -->
      <path d="M400 0 L200 600 L600 600 Z" fill="#fff" opacity="0.05"/>
      
      <!-- Silhouettes -->
      <rect x="300" y="200" width="80" height="200" fill="#000"/> <!-- Body 1 -->
      <circle cx="340" cy="180" r="30" fill="#000"/> <!-- Head 1 -->
      <rect x="310" y="160" width="60" height="10" fill="#000"/> <!-- Hat Brim 1 -->
      <rect x="320" y="140" width="40" height="20" fill="#000"/> <!-- Hat Top 1 -->
      
      <rect x="420" y="220" width="80" height="180" fill="#000"/> <!-- Body 2 -->
      <circle cx="460" cy="200" r="30" fill="#000"/> <!-- Head 2 -->
      <rect x="430" y="180" width="60" height="10" fill="#000"/> <!-- Hat Brim 2 -->
      <rect x="440" y="160" width="40" height="20" fill="#000"/> <!-- Hat Top 2 -->
      
      <!-- Sunglasses Reflection -->
      <rect x="325" y="175" width="30" height="5" fill="#333"/>
      <rect x="445" y="195" width="30" height="5" fill="#333"/>
      
      <!-- Neuralyzer Flash -->
      <circle cx="400" cy="300" r="10" fill="#fff" filter="url(#glow-t41)">
         <animate attributeName="r" values="10;50;10" dur="2s" repeatCount="indefinite"/>
         <animate attributeName="opacity" values="1;0;1" dur="0.2s" repeatCount="indefinite"/>
      </circle>
      
      <!-- Black Sedan -->
      <path d="M100 500 L200 450 L600 450 L700 500 L700 550 L100 550 Z" fill="#000"/>
      <circle cx="200" cy="550" r="30" fill="#111"/>
      <circle cx="600" cy="550" r="30" fill="#111"/>
    `,
    overlay: GRIDS.standard
  },
  't42': { // Area 51
    bgGradient: ['#ea580c', '#7c2d12'], // Desert Sunset
    accentColor: '#facc15', // Warning Yellow
    shapes: `
      <!-- Mountains -->
      <path d="M0 400 L200 200 L400 400 L600 150 L800 400 L800 600 L0 600 Z" fill="#431407"/>
      
      <!-- Hangar 18 -->
      <rect x="350" y="350" width="150" height="100" fill="#52525b"/>
      <path d="M350 350 L425 300 L500 350" fill="#71717a"/> <!-- Roof -->
      <rect x="390" y="400" width="70" height="50" fill="#27272a"/> <!-- Door -->
      
      <!-- Warning Sign -->
      <rect x="100" y="450" width="100" height="80" fill="#fff" stroke="#000" stroke-width="2"/>
      <rect x="105" y="455" width="90" height="70" fill="#ef4444"/>
      <text x="150" y="490" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">RESTRICTED</text>
      <text x="150" y="510" font-family="sans-serif" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">AREA 51</text>
      <line x1="150" y1="530" x2="150" y2="600" stroke="#000" stroke-width="4"/> <!-- Post -->
      
      <!-- Saucer Silhouette -->
      <ellipse cx="600" cy="100" rx="60" ry="15" fill="#000" opacity="0.8"/>
      <circle cx="600" cy="90" r="10" fill="#000" opacity="0.8"/>
      
      <!-- Barbed Wire (Abstract) -->
      <line x1="0" y1="550" x2="800" y2="550" stroke="#000" stroke-width="2"/>
      <path d="M10 540 L20 560 M100 540 L110 560 M200 540 L210 560" stroke="#000" stroke-width="2"/>
    `,
    overlay: GRIDS.checkers
  },
  't44': { // Philadelphia Experiment
    bgGradient: ['#064e3b', '#022c22'], // Green Mist
    accentColor: '#4ade80', // Electric Green
    shapes: `
      <!-- Ocean -->
      <rect x="0" y="400" width="800" height="200" fill="#065f46"/>
      
      <!-- Ship Hull (Fading/Wireframe) -->
      <path d="M100 450 L700 450 L650 550 L150 550 Z" fill="none" stroke="#4ade80" stroke-width="2" stroke-dasharray="10 5" opacity="0.5"/>
      <rect x="250" y="300" width="100" height="150" fill="none" stroke="#4ade80" stroke-width="2" opacity="0.3"/>
      <rect x="450" y="300" width="100" height="150" fill="none" stroke="#4ade80" stroke-width="2" opacity="0.3"/>
      
      <!-- Green Mist/Plasma -->
      <circle cx="400" cy="400" r="200" fill="url(#grad-radial-white)" opacity="0.2"/>
      <path d="M0 400 Q200 300 400 400 T800 400" fill="none" stroke="#22c55e" stroke-width="20" filter="url(#glow-t44)" opacity="0.3"/>
      
      <!-- Lightning Arcs -->
      <path d="M200 300 L250 400 L300 350 L400 500" fill="none" stroke="#a7f3d0" stroke-width="2" filter="url(#glow-t44)"/>
      <path d="M600 300 L550 400 L500 350 L400 500" fill="none" stroke="#a7f3d0" stroke-width="2" filter="url(#glow-t44)"/>
    `,
    overlay: GRIDS.waves
  },
  't52': { // Bermuda Triangle
    bgGradient: ['#1e3a8a', '#172554'], // Deep Ocean
    accentColor: '#38bdf8', // Vortex Blue
    shapes: `
      <!-- Triangle Zone -->
      <path d="M100 100 L700 100 L400 550 Z" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="10 10" opacity="0.5"/>
      
      <!-- Vortex Water -->
      <circle cx="400" cy="300" r="250" fill="none" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="400" cy="300" r="180" fill="none" stroke="#1e40af" stroke-width="2"/>
      <circle cx="400" cy="300" r="100" fill="none" stroke="#1e3a8a" stroke-width="2"/>
      <circle cx="400" cy="300" r="40" fill="#000"/>
      
      <!-- Plane Silhouette -->
      <path d="M200 200 L250 180 L300 200 L250 250 Z" fill="#000" transform="rotate(45 250 200)"/>
      
      <!-- Ship Sinking -->
      <path d="M500 400 L600 400 L580 450 L520 450 Z" fill="#000" transform="rotate(30 550 425)"/>
      
      <!-- Compass Rose (Distorted) -->
      <path d="M700 50 L720 100 L740 50 L720 0 Z" fill="#ef4444" transform="rotate(15 720 50)"/>
      <circle cx="720" cy="50" r="40" fill="none" stroke="#94a3b8" stroke-width="2"/>
    `,
    overlay: GRIDS.waves
  },
  't55': { // Tunguska
    bgGradient: ['#7c2d12', '#451a03'], // Fire/Explosion
    accentColor: '#fbbf24', // Flash
    shapes: `
      <!-- Fallen Trees (Radial) -->
      <line x1="400" y1="300" x2="400" y2="100" stroke="#000" stroke-width="2"/>
      <line x1="400" y1="300" x2="600" y2="300" stroke="#000" stroke-width="2"/>
      <line x1="400" y1="300" x2="200" y2="300" stroke="#000" stroke-width="2"/>
      <line x1="400" y1="300" x2="400" y2="500" stroke="#000" stroke-width="2"/>
      <line x1="400" y1="300" x2="550" y2="150" stroke="#000" stroke-width="2"/>
      <line x1="400" y1="300" x2="250" y2="150" stroke="#000" stroke-width="2"/>
      <line x1="400" y1="300" x2="550" y2="450" stroke="#000" stroke-width="2"/>
      <line x1="400" y1="300" x2="250" y2="450" stroke="#000" stroke-width="2"/>
      
      <!-- Shockwave Rings -->
      <circle cx="400" cy="300" r="50" fill="none" stroke="#f97316" stroke-width="2"/>
      <circle cx="400" cy="300" r="100" fill="none" stroke="#ea580c" stroke-width="2" opacity="0.8"/>
      <circle cx="400" cy="300" r="150" fill="none" stroke="#c2410c" stroke-width="2" opacity="0.6"/>
      
      <!-- Fireball -->
      <circle cx="400" cy="300" r="20" fill="#fff" filter="url(#glow-t55)"/>
      <path d="M300 0 L500 0 L400 300 Z" fill="url(#grad-radial-white)" opacity="0.2"/>
    `,
    overlay: GRIDS.dots
  },

  // --- BATCH 9 (MEDIA & CULTURE) ---
  'm1': { // The Matrix
    bgGradient: ['#000000', '#022c22'], // Black to Dark Green
    accentColor: '#22c55e', // Matrix Green
    shapes: `
      <!-- Falling Code -->
      <rect x="0" y="0" width="800" height="600" fill="url(#p-matrix)" opacity="0.3"/>
      <text x="100" y="200" font-family="monospace" font-size="20" fill="#22c55e" opacity="0.8">W A K E  U P</text>
      
      <!-- Pills -->
      <g transform="translate(350, 400)">
         <!-- Red Pill -->
         <ellipse cx="-50" cy="0" rx="30" ry="15" fill="#ef4444" transform="rotate(-30)"/>
         <ellipse cx="-50" cy="0" rx="30" ry="15" fill="url(#grad-radial-white)" opacity="0.2" transform="rotate(-30)"/>
         <!-- Blue Pill -->
         <ellipse cx="50" cy="0" rx="30" ry="15" fill="#3b82f6" transform="rotate(30)"/>
         <ellipse cx="50" cy="0" rx="30" ry="15" fill="url(#grad-radial-white)" opacity="0.2" transform="rotate(30)"/>
      </g>
      
      <!-- Mirror Effect -->
      <path d="M300 300 Q400 400 500 300" fill="none" stroke="#fff" stroke-width="2" opacity="0.2"/>
    `,
    overlay: GRIDS.matrix
  },
  'm2': { // X-Files
    bgGradient: ['#0f172a', '#000000'], // Dark Forest Night
    accentColor: '#facc15', // Flashlight Beam
    shapes: `
      <!-- Flashlight Cone -->
      <path d="M800 300 L200 100 L200 500 Z" fill="url(#grad-radial-white)" opacity="0.1"/>
      <circle cx="200" cy="300" r="100" fill="#fff" opacity="0.1" filter="url(#glow-m2)"/>
      
      <!-- Forest Silhouettes -->
      <path d="M100 600 L120 100 L140 600" fill="#020617"/>
      <path d="M500 600 L530 150 L560 600" fill="#020617"/>
      <path d="M700 600 L720 200 L740 600" fill="#020617"/>
      
      <!-- The X -->
      <text x="650" y="150" font-family="sans-serif" font-size="120" font-weight="bold" fill="#ef4444" opacity="0.8" transform="rotate(15 650 150)">X</text>
      
      <!-- UFO in distance -->
      <ellipse cx="100" cy="100" rx="30" ry="10" fill="#fff" opacity="0.5"/>
    `,
    overlay: GRIDS.standard
  },
  'm3': { // Deus Ex
    bgGradient: ['#000000', '#1c1917'], // Black & Gold
    accentColor: '#eab308', // Cyber Gold
    shapes: `
      <!-- Globe Grid -->
      <circle cx="400" cy="300" r="200" fill="none" stroke="#eab308" stroke-width="1"/>
      <path d="M200 300 Q400 400 600 300" fill="none" stroke="#eab308" stroke-width="1"/>
      <path d="M200 300 Q400 200 600 300" fill="none" stroke="#eab308" stroke-width="1"/>
      <line x1="400" y1="100" x2="400" y2="500" stroke="#eab308" stroke-width="1"/>
      
      <!-- Triangles / Shards -->
      <path d="M400 300 L600 100 L800 300" fill="none" stroke="#ca8a04" stroke-width="2"/>
      <path d="M0 600 L200 400 L400 600" fill="#ca8a04" opacity="0.2"/>
      
      <!-- Cyber Eye Overlay -->
      <circle cx="600" cy="200" r="40" fill="none" stroke="#eab308" stroke-width="3" stroke-dasharray="10 5"/>
      <circle cx="600" cy="200" r="10" fill="#eab308"/>
      <line x1="600" y1="200" x2="700" y2="150" stroke="#eab308" stroke-width="1"/>
    `,
    overlay: GRIDS.hex
  },
  'm4': { // They Live
    bgGradient: ['#ffffff', '#e5e5e5'], // Stark Black/White
    accentColor: '#000000',
    shapes: `
      <!-- Glasses Frame -->
      <path d="M150 250 L350 250 L350 350 L150 350 Z" fill="#000" opacity="0.9"/>
      <path d="M450 250 L650 250 L650 350 L450 350 Z" fill="#000" opacity="0.9"/>
      <line x1="350" y1="280" x2="450" y2="280" stroke="#000" stroke-width="10"/>
      
      <!-- Subliminal Text -->
      <text x="400" y="150" font-family="sans-serif" font-size="80" font-weight="900" fill="#000" text-anchor="middle" letter-spacing="10">OBEY</text>
      <text x="400" y="500" font-family="sans-serif" font-size="60" font-weight="900" fill="#000" text-anchor="middle" letter-spacing="5">CONSUME</text>
      
      <!-- Alien Face in Lens (Subtle) -->
      <circle cx="250" cy="300" r="20" fill="#fff" opacity="0.2"/>
      <circle cx="550" cy="300" r="20" fill="#fff" opacity="0.2"/>
    `,
    overlay: GRIDS.checkers
  },
  'm5': { // Illuminatus!
    bgGradient: ['#4c1d95', '#fbbf24'], // Purple & Gold (Chaos)
    accentColor: '#facc15',
    shapes: `
      <!-- Golden Apple -->
      <circle cx="400" cy="300" r="100" fill="#facc15" stroke="#b45309" stroke-width="3"/>
      <path d="M400 200 Q420 150 450 180" fill="none" stroke="#166534" stroke-width="5"/> <!-- Stem -->
      <path d="M420 180 Q450 150 480 180 Q450 210 420 180" fill="#16a34a"/> <!-- Leaf -->
      <text x="400" y="320" font-family="greek" font-size="24" text-anchor="middle" fill="#b45309">KALLISTI</text>
      
      <!-- Chaos Star (Eris) -->
      <g stroke="#fff" stroke-width="2" transform="translate(100, 100) scale(0.5)">
         <line x1="0" y1="-50" x2="0" y2="50"/>
         <line x1="-40" y1="-30" x2="40" y2="30"/>
         <line x1="-40" y1="30" x2="40" y2="-30"/>
         <path d="M-10 -60 L0 -50 L10 -60" fill="none"/> 
      </g>
      
      <!-- Submarine -->
      <path d="M600 500 Q700 500 750 520 L750 550 L550 550 Q500 520 600 500" fill="#facc15"/>
      <rect x="620" y="480" width="20" height="20" fill="#facc15"/>
    `,
    overlay: GRIDS.waves
  },
  'm25': { // Inside Job
    bgGradient: ['#1e293b', '#334155'], // Office Grey/Blue
    accentColor: '#ef4444',
    shapes: `
      <!-- Boardroom Table -->
      <path d="M100 500 L700 500 L600 400 L200 400 Z" fill="#0f172a"/>
      
      <!-- Shadow Figures (Robes) -->
      <path d="M350 400 L400 250 L450 400 Z" fill="#000"/>
      <circle cx="400" cy="250" r="30" fill="#000"/> <!-- Head -->
      <path d="M370 250 L430 250 L400 220 Z" fill="#000"/> <!-- Hood -->
      
      <path d="M200 400 L250 300 L300 400 Z" fill="#000" opacity="0.8"/>
      <circle cx="250" cy="300" r="25" fill="#000" opacity="0.8"/>
      
      <path d="M500 400 L550 300 L600 400 Z" fill="#000" opacity="0.8"/>
      <circle cx="550" cy="300" r="25" fill="#000" opacity="0.8"/>
      
      <!-- Hologram Earth -->
      <circle cx="400" cy="150" r="60" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5 5"/>
      <path d="M360 150 Q400 180 440 150" fill="none" stroke="#38bdf8" stroke-width="1"/>
      <line x1="400" y1="200" x2="400" y2="400" stroke="#38bdf8" stroke-width="2" opacity="0.3"/>
      
      <!-- Organizational Chart Background -->
      <line x1="50" y1="50" x2="750" y2="50" stroke="#64748b" stroke-width="1"/>
      <line x1="400" y1="50" x2="400" y2="100" stroke="#64748b" stroke-width="1"/>
    `,
    overlay: GRIDS.standard
  },

  // --- BATCH 10 (AUTHORS: a1-a10) ---
  'a1': { // Sutton
    bgGradient: ['#3f3f46', '#18181b'],
    accentColor: '#ef4444',
    shapes: `
      <!-- Financial Bar Chart -->
      <rect x="100" y="400" width="50" height="200" fill="#ef4444"/>
      <rect x="200" y="300" width="50" height="300" fill="#dc2626"/>
      <rect x="300" y="200" width="50" height="400" fill="#b91c1c"/>
      
      <!-- Prison Bars Overlay -->
      <line x1="50" y1="100" x2="50" y2="600" stroke="#000" stroke-width="5"/>
      <line x1="150" y1="100" x2="150" y2="600" stroke="#000" stroke-width="5"/>
      <line x1="250" y1="100" x2="250" y2="600" stroke="#000" stroke-width="5"/>
      <line x1="350" y1="100" x2="350" y2="600" stroke="#000" stroke-width="5"/>
      
      <!-- Wall Street Canyon -->
      <path d="M500 600 L500 200 L600 200 L600 600" fill="#27272a"/>
      <path d="M700 600 L700 100 L800 100 L800 600" fill="#27272a"/>
      
      <!-- Totalitarian Symbol (Abstract) -->
      <circle cx="600" cy="150" r="40" fill="none" stroke="#fff" stroke-width="4"/>
      <path d="M580 130 L620 170 M620 130 L580 170" stroke="#fff" stroke-width="4"/>
    `,
    overlay: GRIDS.standard
  },
  'a2': { // Gary Allen
    bgGradient: ['#1e3a8a', '#172554'],
    accentColor: '#93c5fd',
    shapes: `
      <!-- Spotlight -->
      <path d="M400 0 L100 600 L700 600 Z" fill="url(#grad-radial-white)" opacity="0.1"/>
      
      <!-- The Insider File -->
      <rect x="250" y="200" width="300" height="400" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="250" y="200" width="300" height="50" fill="#0f172a"/>
      <text x="400" y="235" font-family="monospace" font-size="20" fill="#ef4444" text-anchor="middle">CONFIDENTIAL</text>
      
      <!-- Text Blocks -->
      <rect x="280" y="280" width="240" height="20" fill="#475569"/>
      <rect x="280" y="320" width="240" height="20" fill="#475569"/>
      <rect x="280" y="360" width="180" height="20" fill="#475569"/>
      
      <!-- Magnifying Glass -->
      <circle cx="500" cy="450" r="80" fill="none" stroke="#93c5fd" stroke-width="10"/>
      <line x1="560" y1="510" x2="650" y2="600" stroke="#93c5fd" stroke-width="10"/>
      <circle cx="500" cy="450" r="70" fill="#fff" opacity="0.1"/>
    `,
    overlay: GRIDS.dots
  },
  'a3': { // Quigley
    bgGradient: ['#451a03', '#78350f'], // Academic Brown/Gold
    accentColor: '#facc15',
    shapes: `
      <!-- Round Table -->
      <circle cx="400" cy="350" r="200" fill="#292524" stroke="#facc15" stroke-width="4"/>
      
      <!-- Intersecting Rings -->
      <circle cx="400" cy="250" r="80" fill="none" stroke="#facc15" stroke-width="2" opacity="0.6"/>
      <circle cx="320" cy="400" r="80" fill="none" stroke="#facc15" stroke-width="2" opacity="0.6"/>
      <circle cx="480" cy="400" r="80" fill="none" stroke="#facc15" stroke-width="2" opacity="0.6"/>
      
      <!-- Book Spine -->
      <rect x="50" y="50" width="100" height="500" fill="#78350f" stroke="#fcd34d" stroke-width="2"/>
      <line x1="70" y1="50" x2="70" y2="550" stroke="#fcd34d" stroke-width="1"/>
      <line x1="130" y1="50" x2="130" y2="550" stroke="#fcd34d" stroke-width="1"/>
    `,
    overlay: GRIDS.checkers
  },
  'a4': { // Cooper
    bgGradient: ['#0f172a', '#059669'], // Pale Greenish/Dark
    accentColor: '#34d399',
    shapes: `
      <!-- Pale Horse Silhouette -->
      <path d="M400 300 Q450 250 500 280 L520 250 Q550 200 500 180 Q450 200 420 250 L400 300 Z" fill="#d1fae5" opacity="0.8"/> <!-- Head -->
      <path d="M400 300 L300 400 L200 400 L150 500" fill="none" stroke="#d1fae5" stroke-width="5" opacity="0.5"/> <!-- Body hint -->
      
      <!-- Microphone -->
      <rect x="600" y="300" width="60" height="100" rx="20" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
      <line x1="630" y1="400" x2="630" y2="500" stroke="#64748b" stroke-width="4"/>
      <path d="M600 300 L660 400" stroke="#000" stroke-width="1" opacity="0.2"/> <!-- Grid on mic -->
      <path d="M660 300 L600 400" stroke="#000" stroke-width="1" opacity="0.2"/>
      
      <!-- Radio Waves -->
      <path d="M630 280 Q680 250 730 280" fill="none" stroke="#34d399" stroke-width="3"/>
      <path d="M630 260 Q700 210 770 260" fill="none" stroke="#34d399" stroke-width="3"/>
    `,
    overlay: GRIDS.standard
  },
  'a5': { // Icke
    bgGradient: ['#2e1065', '#4c1d95'], // Reptilian Purple/Green
    accentColor: '#84cc16',
    shapes: `
      <!-- Matrix Rain Background -->
      <rect x="0" y="0" width="800" height="600" fill="url(#p-matrix)" opacity="0.4"/>
      
      <!-- Human Face Silhouette split -->
      <path d="M300 100 Q500 100 500 300 Q500 500 300 500 Q100 500 100 300 Q100 100 300 100" fill="#000"/>
      <path d="M300 100 L300 500" stroke="#84cc16" stroke-width="2"/>
      
      <!-- Reptilian Eye on Right Side -->
      <path d="M350 250 Q420 200 450 250 Q420 300 350 250" fill="#000" stroke="#84cc16" stroke-width="2"/>
      <ellipse cx="400" cy="250" rx="5" ry="20" fill="#84cc16"/>
      
      <!-- Scales Overlay -->
      <path d="M300 100 Q500 100 500 300 Q500 500 300 500" fill="url(#p-hex)" opacity="0.3"/>
    `,
    overlay: GRIDS.hex
  },
  'a6': { // Marrs
    bgGradient: ['#3f3f46', '#000000'],
    accentColor: '#ef4444',
    shapes: `
      <!-- Crosshairs -->
      <circle cx="400" cy="300" r="200" fill="none" stroke="#ef4444" stroke-width="2"/>
      <line x1="400" y1="100" x2="400" y2="500" stroke="#ef4444" stroke-width="1"/>
      <line x1="200" y1="300" x2="600" y2="300" stroke="#ef4444" stroke-width="1"/>
      
      <!-- Blurred Files -->
      <rect x="100" y="100" width="150" height="200" fill="#fff" opacity="0.1" transform="rotate(-10 175 200)"/>
      <rect x="550" y="400" width="150" height="200" fill="#fff" opacity="0.1" transform="rotate(10 625 500)"/>
      
      <!-- Limo Outline (Abstract) -->
      <path d="M300 450 L500 450 L550 500 L250 500 Z" fill="#000"/>
      <circle cx="300" cy="500" r="20" fill="#333"/>
      <circle cx="500" cy="500" r="20" fill="#333"/>
    `,
    overlay: GRIDS.dots
  },
  'a7': { // Griffin (Jekyll Island)
    bgGradient: ['#064e3b', '#022c22'], // Money Green
    accentColor: '#22c55e',
    shapes: `
      <!-- Bank Building (Abstract) -->
      <rect x="300" y="200" width="200" height="200" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
      <path d="M300 200 L400 100 L500 200" fill="none" stroke="#22c55e" stroke-width="2"/>
      
      <!-- Octopus Tentacles -->
      <path d="M200 500 Q300 400 350 400" fill="none" stroke="#166534" stroke-width="20" stroke-linecap="round"/>
      <path d="M600 500 Q500 400 450 400" fill="none" stroke="#166534" stroke-width="20" stroke-linecap="round"/>
      <path d="M150 300 Q250 250 300 300" fill="none" stroke="#166534" stroke-width="20" stroke-linecap="round"/>
      <path d="M650 300 Q550 250 500 300" fill="none" stroke="#166534" stroke-width="20" stroke-linecap="round"/>
      
      <!-- Dollar Sign -->
      <text x="400" y="330" font-family="serif" font-size="100" fill="#22c55e" text-anchor="middle">$</text>
    `,
    overlay: GRIDS.waves
  },
  'a8': { // Engdahl
    bgGradient: ['#000000', '#451a03'], // Oil/Earth
    accentColor: '#facc15',
    shapes: `
      <!-- Oil Drop -->
      <path d="M400 100 Q300 300 300 400 A 100 100 0 1 0 500 400 Q500 300 400 100" fill="#000" stroke="#333" stroke-width="2"/>
      <path d="M380 200 Q350 300 380 350" fill="none" stroke="#fff" stroke-width="5" opacity="0.2"/>
      
      <!-- Seeds / Biohazard -->
      <circle cx="400" cy="400" r="60" fill="none" stroke="#facc15" stroke-width="4"/>
      <circle cx="400" cy="400" r="20" fill="#facc15"/>
      <path d="M400 400 L350 350 M400 400 L450 350 M400 400 L400 470" stroke="#facc15" stroke-width="4"/>
      
      <!-- Barrels -->
      <rect x="100" y="450" width="60" height="80" fill="#1c1917" stroke="#44403c"/>
      <rect x="640" y="450" width="60" height="80" fill="#1c1917" stroke="#44403c"/>
    `,
    overlay: GRIDS.standard
  },
  'a9': { // Coleman (Committee 300)
    bgGradient: ['#450a0a', '#000000'],
    accentColor: '#ef4444',
    shapes: `
      <!-- Pyramid Hierarchy -->
      <path d="M100 550 L400 50 L700 550 Z" fill="none" stroke="#ef4444" stroke-width="2"/>
      <line x1="250" y1="300" x2="550" y2="300" stroke="#ef4444" stroke-width="1"/>
      <line x1="340" y1="150" x2="460" y2="150" stroke="#ef4444" stroke-width="1"/>
      
      <!-- 300 Nodes (Abstract) -->
      <rect x="100" y="550" width="600" height="50" fill="url(#p-dots)"/>
      <text x="400" y="100" font-family="serif" font-size="24" fill="#ef4444" text-anchor="middle">300</text>
      
      <!-- Distorted Music Notes -->
      <path d="M100 100 Q150 50 200 100" fill="none" stroke="#fff" stroke-width="2" opacity="0.3"/>
      <circle cx="100" cy="120" r="10" fill="#fff" opacity="0.3"/>
      <rect x="95" y="80" width="5" height="40" fill="#fff" opacity="0.3"/>
    `,
    overlay: GRIDS.checkers
  },
  'a10': { // Mullins
    bgGradient: ['#f3f4f6', '#d1d5db'], // Clinical/Marble
    accentColor: '#94a3b8',
    shapes: `
      <!-- Columns (Federal Reserve) -->
      <rect x="150" y="100" width="40" height="400" fill="#e5e5e5" stroke="#9ca3af"/>
      <rect x="250" y="100" width="40" height="400" fill="#e5e5e5" stroke="#9ca3af"/>
      <rect x="350" y="100" width="40" height="400" fill="#e5e5e5" stroke="#9ca3af"/>
      <rect x="450" y="100" width="40" height="400" fill="#e5e5e5" stroke="#9ca3af"/>
      <rect x="550" y="100" width="40" height="400" fill="#e5e5e5" stroke="#9ca3af"/>
      <rect x="100" y="50" width="550" height="50" fill="#e5e5e5" stroke="#9ca3af"/>
      
      <!-- Syringe Overlay -->
      <rect x="300" y="200" width="200" height="40" fill="#fff" stroke="#ef4444" stroke-width="2" transform="rotate(45 400 300)" opacity="0.8"/>
      <line x1="500" y1="200" x2="600" y2="100" stroke="#9ca3af" stroke-width="4" transform="rotate(45 400 300)"/>
      <path d="M400 300 L420 320" stroke="#ef4444" stroke-width="2"/>
    `,
    overlay: GRIDS.standard
  }
};

export const generateArt = (id: string, category: string, title: string): string => {
  const config = THEORY_ART_CONFIG[id] || {
    bgGradient: ['#0f172a', '#1e293b'],
    accentColor: '#94a3b8',
    shapes: `<text x="400" y="300" font-family="monospace" font-size="24" fill="#fff" text-anchor="middle" opacity="0.5">${title}</text>`,
    overlay: GRIDS.standard
  };

  const overlayId = config.overlay.match(/id="([^"]+)"/)?.[1] || 'p-grid';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${config.bgGradient[0]}" />
          <stop offset="100%" stop-color="${config.bgGradient[1]}" />
        </linearGradient>
        <filter id="glow-${id}">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="grad-radial-white">
            <stop offset="0" stop-color="white" stop-opacity="0.5"/>
            <stop offset="1" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="grad-radial-purple">
            <stop offset="0" stop-color="#a855f7" stop-opacity="0.5"/>
            <stop offset="1" stop-color="#a855f7" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="beingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="white" stop-opacity="0.9"/>
            <stop offset="1" stop-color="#38bdf8" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="viewBeam" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#a855f7" stop-opacity="0.5"/>
            <stop offset="1" stop-color="#a855f7" stop-opacity="0"/>
        </linearGradient>
        ${config.overlay}
      </defs>
      
      <rect width="800" height="600" fill="url(#bg-${id})" />
      
      ${config.shapes}
      
      <!-- Scanlines / Grain Overlay -->
      <rect width="100%" height="100%" fill="url(#${overlayId})" opacity="0.1" pointer-events="none"/>
      
      <!-- Vignette -->
      <radialGradient id="vignette">
        <stop offset="50%" stop-color="transparent"/>
        <stop offset="100%" stop-color="black" stop-opacity="0.6"/>
      </radialGradient>
      <rect width="100%" height="100%" fill="url(#vignette)" pointer-events="none"/>
      
      <!-- Title (Subtle watermark) -->
      <text x="20" y="580" font-family="monospace" font-size="10" fill="white" opacity="0.3">ID: ${id.toUpperCase()} // CAT: ${category.toUpperCase()}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
