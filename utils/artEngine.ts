
const GRIDS = {
  dots: `<pattern id="p-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)"/></pattern>`,
  hex: `<pattern id="p-hex" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>`,
  waves: `<pattern id="p-waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>`,
  polar: `<pattern id="p-polar" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.05)"/><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)"/></pattern>`,
  standard: `<pattern id="p-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>`,
  checkers: `<pattern id="p-checkers" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="20" height="20" fill="rgba(255,255,255,0.1)"/><rect x="20" y="20" width="20" height="20" fill="rgba(255,255,255,0.1)"/></pattern>`,
  matrix: `<pattern id="p-matrix" x="0" y="0" width="20" height="40" patternUnits="userSpaceOnUse"><text x="0" y="20" fill="#22c55e" font-family="monospace" font-size="20" opacity="0.3">1</text><text x="10" y="40" fill="#22c55e" font-family="monospace" font-size="20" opacity="0.2">0</text></pattern>`,
  noise: `<pattern id="p-noise" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(#noiseFilter)" opacity="0.1"/></pattern>`,
  circuit: `<pattern id="p-circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M20 20 H80 V80 H20 Z M50 20 V0 M50 80 V100 M20 50 H0 M80 50 H100" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/><circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.1)"/></pattern>`
};

interface ArtConfig {
  bgGradient: string[];
  accentColor: string;
  shapes: string;
  overlay: string;
}

// --- XML ESCAPE UTILITY ---
// Critical: Prevents broken images when text contains &, <, >, etc.
const escapeXML = (str: string) => {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
};

// --- SAFE ENCODING UTILITY ---
function utf8_to_b64(str: string): string {
  try {
    return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        }));
  } catch (e: unknown) {
    console.error("Encoding error", e);
    return "";
  }
}

// --- PROCEDURAL GENERATOR ---
const generateProceduralConfig = (id: string, seedStr: string): ArtConfig => {
  let hash = 0;
  const str = id + seedStr;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const rand = (min: number, max: number) => {
    const x = Math.sin(hash++) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)];

  const palettes = [
    { bg: ['#0f172a', '#1e293b'], acc: '#06b6d4' }, // Cyan/Slate
    { bg: ['#2e1065', '#4c1d95'], acc: '#d8b4fe' }, // Purple
    { bg: ['#450a0a', '#7f1d1d'], acc: '#fca5a5' }, // Red
    { bg: ['#022c22', '#064e3b'], acc: '#34d399' }, // Green
    { bg: ['#172554', '#1e3a8a'], acc: '#60a5fa' }, // Blue
    { bg: ['#451a03', '#78350f'], acc: '#fbbf24' }, // Amber
    { bg: ['#18181b', '#27272a'], acc: '#a1a1aa' }, // Monochrome
  ];

  const palette = pick(palettes);
  const overlayKey = pick(Object.keys(GRIDS));
  const overlay = GRIDS[overlayKey as keyof typeof GRIDS];

  const shapes = [];
  const type = rand(0, 4); 

  if (type === 0) { // Radar
    shapes.push(`<circle cx="400" cy="300" r="200" fill="none" stroke="${palette.acc}" stroke-width="2" opacity="0.5"/>`);
    shapes.push(`<circle cx="400" cy="300" r="120" fill="none" stroke="${palette.acc}" stroke-width="1" opacity="0.3"/>`);
    shapes.push(`<path d="M400 300 L600 150" stroke="${palette.acc}" stroke-width="2" stroke-dasharray="5 5" opacity="0.8"/>`);
    shapes.push(`<circle cx="600" cy="150" r="5" fill="#fff" filter="url(#glow-${id})"/>`);
  } else if (type === 1) { // Network
    for(let i=0; i<6; i++) {
        const cx = rand(100, 700);
        const cy = rand(100, 500);
        shapes.push(`<circle cx="${cx}" cy="${cy}" r="${rand(3,10)}" fill="${palette.acc}" opacity="0.6"/>`);
        shapes.push(`<line x1="400" y1="300" x2="${cx}" y2="${cy}" stroke="${palette.acc}" stroke-width="1" opacity="0.3"/>`);
    }
    shapes.push(`<circle cx="400" cy="300" r="40" fill="none" stroke="#fff" stroke-width="1" opacity="0.2"/>`);
  } else if (type === 2) { // Abstract Blocks
    shapes.push(`<rect x="${rand(100,600)}" y="${rand(100,400)}" width="${rand(50,200)}" height="${rand(50,200)}" fill="none" stroke="${palette.acc}" stroke-width="2"/>`);
    shapes.push(`<rect x="${rand(100,600)}" y="${rand(100,400)}" width="${rand(50,200)}" height="${rand(50,200)}" fill="${palette.acc}" opacity="0.1"/>`);
  } else if (type === 3) { // Orbital
    shapes.push(`<ellipse cx="400" cy="300" rx="250" ry="80" fill="none" stroke="${palette.acc}" stroke-width="2" transform="rotate(-15 400 300)"/>`);
    shapes.push(`<ellipse cx="400" cy="300" rx="250" ry="80" fill="none" stroke="${palette.acc}" stroke-width="1" stroke-dasharray="10 10" transform="rotate(15 400 300)"/>`);
    shapes.push(`<circle cx="400" cy="300" r="30" fill="${palette.acc}" filter="url(#glow-${id})"/>`);
  } else { // Data Stream
    for(let i=0; i<10; i++) {
       shapes.push(`<rect x="${rand(0,800)}" y="${rand(0,600)}" width="${rand(20,100)}" height="2" fill="${palette.acc}" opacity="${(rand(1,5)/10).toFixed(1)}"/>`);
    }
  }

  return {
    bgGradient: palette.bg,
    accentColor: palette.acc,
    shapes: shapes.join(''),
    overlay: overlay
  };
};

const THEORY_ART_CONFIG: Record<string, ArtConfig> = {
  // --- HISTORICAL & SCIENCE ---
  't1': { // Flat Earth
    bgGradient: ['#0f172a', '#1e293b'],
    accentColor: '#38bdf8',
    shapes: `<ellipse cx="400" cy="450" rx="300" ry="100" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2" opacity="0.8"/><path d="M100 450 Q400 250 700 450" fill="none" stroke="#e0f2fe" stroke-width="2" stroke-dasharray="10 5" opacity="0.5"/><rect x="395" y="200" width="10" height="250" fill="#38bdf8" opacity="0.5"/><circle cx="400" cy="200" r="40" fill="none" stroke="#38bdf8" stroke-width="2"/><circle cx="400" cy="200" r="5" fill="#fff" filter="url(#glow-t1)"/>`,
    overlay: GRIDS.polar
  },
  't2': { // Chemtrails
    bgGradient: ['#3b82f6', '#93c5fd'],
    accentColor: '#fff',
    shapes: `<path d="M-100 500 L900 100" stroke="#fff" stroke-width="15" stroke-linecap="round" filter="url(#glow-t2)" opacity="0.8"/><path d="M-100 550 L900 150" stroke="#fff" stroke-width="15" stroke-linecap="round" filter="url(#glow-t2)" opacity="0.8"/><circle cx="600" cy="100" r="30" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.6"/>`,
    overlay: GRIDS.standard
  },
  't4': { // Moon Landing
    bgGradient: ['#111', '#333'],
    accentColor: '#fbbf24',
    shapes: `<circle cx="400" cy="300" r="150" fill="#e5e5e5" filter="url(#glow-t4)" opacity="0.9"/><circle cx="450" cy="250" r="20" fill="#d4d4d4" opacity="0.5"/><circle cx="380" cy="350" r="30" fill="#d4d4d4" opacity="0.5"/><line x1="400" y1="0" x2="400" y2="150" stroke="#fff" stroke-width="2"/><circle cx="400" cy="150" r="5" fill="red" class="animate-pulse"/>`,
    overlay: GRIDS.dots
  },
  't16': { // JFK
    bgGradient: ['#1e3a8a', '#991b1b'],
    accentColor: '#ef4444',
    shapes: `<path d="M200 500 L600 500 L600 450 L500 450 L450 400 L250 400 L200 450 Z" fill="#000"/><path d="M700 100 L500 300 L450 250 L400 420" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="10 5" filter="url(#glow-t16)"/><circle cx="400" cy="300" r="250" fill="none" stroke="#000" stroke-width="1" opacity="0.3"/>`,
    overlay: GRIDS.standard
  },
  't17': { // Roswell
    bgGradient: ['#7c2d12', '#0f172a'],
    accentColor: '#fbbf24',
    shapes: `<path d="M0 400 Q200 350 400 400 Q600 450 800 400 L800 600 L0 600 Z" fill="#9a3412"/><ellipse cx="500" cy="380" rx="100" ry="30" fill="#334155" transform="rotate(-20 500 380)"/><path d="M450 350 L550 410" stroke="#000" stroke-width="2"/><circle cx="520" cy="350" r="20" fill="#57534e" opacity="0.6"/><path d="M300 550 L310 500 L320 550 M310 500 L330 510" stroke="#a3e635" stroke-width="2" opacity="0.8"/>`,
    overlay: GRIDS.dots
  },
  't18': { // 9/11
    bgGradient: ['#451a03', '#78350f'],
    accentColor: '#f97316',
    shapes: `<rect x="250" y="100" width="80" height="500" fill="#1c1917"/><rect x="470" y="100" width="80" height="500" fill="#1c1917"/><circle cx="290" cy="300" r="5" fill="#f97316" filter="url(#glow-t18)"/><circle cx="290" cy="350" r="5" fill="#f97316" filter="url(#glow-t18)"/><path d="M600 100 Q500 150 290 200" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="10 10" opacity="0.3"/>`,
    overlay: GRIDS.dots
  },
  't23': { // Birds Aren't Real
    bgGradient: ['#bae6fd', '#f1f5f9'],
    accentColor: '#38bdf8',
    shapes: `<path d="M300 300 Q350 200 450 250 L550 220 L500 300 Q450 350 300 300" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/><circle cx="500" cy="250" r="10" fill="#000"/><circle cx="500" cy="250" r="4" fill="#ef4444" filter="url(#glow-t23)"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></circle><line x1="0" y1="500" x2="800" y2="500" stroke="#000" stroke-width="2"/>`,
    overlay: GRIDS.standard
  },
  't24': { // Titanic
    bgGradient: ['#0f172a', '#020617'],
    accentColor: '#94a3b8',
    shapes: `<path d="M100 400 L700 350 L700 500 L100 550 Z" fill="#1e293b"/><rect x="300" y="300" width="30" height="100" fill="#94a3b8"/><rect x="400" y="290" width="30" height="100" fill="#94a3b8"/><rect x="500" y="280" width="30" height="100" fill="#94a3b8"/><path d="M50 500 Q400 600 750 500" fill="none" stroke="#1e40af" stroke-width="50" opacity="0.5"/>`,
    overlay: GRIDS.waves
  },
  't26': { // Phantom Time
    bgGradient: ['#4a044e', '#0f172a'],
    accentColor: '#e879f9',
    shapes: `<rect x="350" y="200" width="100" height="100" fill="none" stroke="#e879f9" stroke-width="2" stroke-dasharray="10 5"/><line x1="300" y1="250" x2="500" y2="250" stroke="#e879f9" stroke-width="1"/><text x="380" y="260" fill="#e879f9" font-family="monospace" font-size="20">NULL</text>`,
    overlay: GRIDS.hex
  },
  't27': { // Paul is Dead
    bgGradient: ['#fff', '#e5e5e5'],
    accentColor: '#000',
    shapes: `<rect x="100" y="400" width="100" height="200" fill="#000"/><rect x="300" y="400" width="100" height="200" fill="#000"/><rect x="500" y="400" width="100" height="200" fill="#000"/><rect x="700" y="400" width="100" height="200" fill="#000"/><path d="M320 450 Q330 430 350 450 L350 480 Q330 500 320 480 Z" fill="#000" opacity="0.8"/><rect x="600" y="300" width="80" height="30" fill="#fbbf24" stroke="#000"/><text x="610" y="320" font-family="monospace" font-size="12" fill="#000">28IF</text>`,
    overlay: GRIDS.standard
  },
  't34': { // Freemasons
    bgGradient: ['#1e1b4b', '#0f172a'],
    accentColor: '#94a3b8',
    shapes: `<path d="M400 150 L250 450 L550 450 Z" stroke="#94a3b8" stroke-width="3" fill="none"/><path d="M400 450 L250 150 L550 150" stroke="#94a3b8" stroke-width="3" fill="none"/><circle cx="400" cy="300" r="30" fill="#94a3b8" opacity="0.5"/>`,
    overlay: GRIDS.checkers
  },
  't36': { // Jesuits
    bgGradient: ['#000000', '#333333'],
    accentColor: '#ef4444',
    shapes: `<rect x="380" y="100" width="40" height="400" fill="#333"/><rect x="300" y="200" width="200" height="40" fill="#333"/><circle cx="400" cy="300" r="80" stroke="#ef4444" stroke-width="2" fill="none"/>`,
    overlay: GRIDS.hex
  },
  't45': { // Skull & Bones
    bgGradient: ['#1c1917', '#000000'],
    accentColor: '#e7e5e4',
    shapes: `<circle cx="400" cy="250" r="60" fill="#e7e5e4"/><rect x="380" y="300" width="40" height="40" fill="#e7e5e4"/><line x1="300" y1="400" x2="500" y2="200" stroke="#e7e5e4" stroke-width="15"/><line x1="500" y1="400" x2="300" y2="200" stroke="#e7e5e4" stroke-width="15"/>`,
    overlay: GRIDS.dots
  },
  't49': { // Tartaria
    bgGradient: ['#78350f', '#451a03'],
    accentColor: '#fcd34d',
    shapes: `<rect x="100" y="300" width="100" height="300" fill="#92400e"/><rect x="300" y="200" width="100" height="400" fill="#92400e"/><rect x="500" y="250" width="100" height="350" fill="#92400e"/><path d="M0 500 Q400 450 800 500 L800 600 L0 600 Z" fill="#573a2e" opacity="0.9"/>`,
    overlay: GRIDS.standard
  },
  't51': { // Atlantis
    bgGradient: ['#082f49', '#0e7490'],
    accentColor: '#22d3ee',
    shapes: `<circle cx="400" cy="300" r="200" fill="none" stroke="#155e75" stroke-width="30"/><circle cx="400" cy="300" r="120" fill="none" stroke="#155e75" stroke-width="30"/><path d="M0 400 Q400 350 800 400 L800 600 L0 600 Z" fill="#164e63" opacity="0.8"/><circle cx="400" cy="300" r="5" fill="#fff" filter="url(#glow-t51)"/>`,
    overlay: GRIDS.waves
  },
  't53': { // Piri Reis
    bgGradient: ['#7c2d12', '#fef3c7'],
    accentColor: '#92400e',
    shapes: `<path d="M100 100 Q400 50 700 100 L650 500 Q350 550 150 500 Z" fill="#fde68a" stroke="#92400e" stroke-width="2"/><path d="M200 200 L300 250 L250 400" stroke="#92400e" stroke-width="1" fill="none"/>`,
    overlay: GRIDS.hex
  },
  't54': { // Knights Templar
    bgGradient: ['#fff', '#e5e5e5'],
    accentColor: '#dc2626',
    shapes: `<rect x="350" y="100" width="100" height="400" fill="#dc2626"/><rect x="200" y="250" width="400" height="100" fill="#dc2626"/>`,
    overlay: GRIDS.checkers
  },
  
  // --- GEOPOLITICS ---
  't5': { // NWO
    bgGradient: ['#020617', '#172554'],
    accentColor: '#ef4444',
    shapes: `<path d="M200 500 L600 500 L550 400 L250 400 Z" fill="#1e293b" stroke="#334155" stroke-width="2"/><path d="M350 150 L450 150 L400 50 Z" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/><circle cx="400" cy="110" r="10" fill="#ef4444" filter="url(#glow-t5)"/><line x1="400" y1="50" x2="400" y2="10" stroke="#ef4444" stroke-width="2" opacity="0.5"/>`,
    overlay: GRIDS.standard
  },
  't7': { // QAnon
    bgGradient: ['#1e1b4b', '#312e81'],
    accentColor: '#ef4444',
    shapes: `<text x="400" y="400" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="300" fill="#1e1b4b" stroke="#ef4444" stroke-width="2">Q</text><path d="M0 0 L800 600 M800 0 L0 600" stroke="#ef4444" stroke-width="1" opacity="0.2"/><circle cx="400" cy="300" r="150" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="20 10" class="animate-spin-slow"/>`,
    overlay: GRIDS.matrix
  },
  't9': { // Great Replacement
    bgGradient: ['#1f2937', '#000'],
    accentColor: '#ef4444',
    shapes: `<rect x="100" y="100" width="50" height="50" fill="#374151"/><rect x="160" y="100" width="50" height="50" fill="#ef4444"/><rect x="220" y="100" width="50" height="50" fill="#374151"/><rect x="100" y="160" width="50" height="50" fill="#ef4444"/>`,
    overlay: GRIDS.checkers
  },
  't30': { // Adrenochrome
    bgGradient: ['#450a0a', '#000'],
    accentColor: '#ef4444',
    shapes: `<path d="M400 100 L500 200 L400 300 L300 200 Z" fill="none" stroke="#ef4444" stroke-width="2"/><circle cx="400" cy="200" r="5" fill="#ef4444" filter="url(#glow-t30)"/><path d="M350 400 Q400 500 450 400" fill="none" stroke="#ef4444" stroke-width="2"/><path d="M380 420 L380 450 M420 420 L420 450" stroke="#fff" stroke-width="2"/>`,
    overlay: GRIDS.hex
  },
  't20': { // Great Reset
    bgGradient: ['#0f172a', '#334155'],
    accentColor: '#38bdf8',
    shapes: `<circle cx="400" cy="300" r="180" fill="none" stroke="#38bdf8" stroke-width="15" stroke-dasharray="280 100" transform="rotate(-90 400 300)"/><path d="M390 120 L400 140 L410 120" fill="#38bdf8"/><rect x="300" y="250" width="200" height="100" fill="#1e293b" opacity="0.8"/><text x="400" y="310" text-anchor="middle" fill="#fff" font-family="monospace" font-size="24">RESET</text>`,
    overlay: GRIDS.standard
  },
  't35': { // Illuminati
    bgGradient: ['#000', '#111'],
    accentColor: '#facc15',
    shapes: `<path d="M200 500 L600 500 L400 150 Z" stroke="#facc15" stroke-width="3" fill="none"/><circle cx="400" cy="300" r="30" fill="#facc15" filter="url(#glow-t35)"/><line x1="400" y1="300" x2="400" y2="150" stroke="#facc15" stroke-width="1"/>`,
    overlay: GRIDS.hex
  },
  't43': { // Bilderberg
    bgGradient: ['#1e3a8a', '#172554'],
    accentColor: '#bfdbfe',
    shapes: `<rect x="300" y="200" width="200" height="200" fill="none" stroke="#bfdbfe" stroke-width="5"/><line x1="300" y1="200" x2="500" y2="400" stroke="#bfdbfe" stroke-width="2"/><line x1="500" y1="200" x2="300" y2="400" stroke="#bfdbfe" stroke-width="2"/>`,
    overlay: GRIDS.standard
  },
  't46': { // Bohemian Grove
    bgGradient: ['#064e3b', '#022c22'],
    accentColor: '#f97316',
    shapes: `<path d="M350 400 Q400 500 450 400 L400 300 Z" fill="#000"/><circle cx="380" cy="350" r="5" fill="#f97316"/><circle cx="420" cy="350" r="5" fill="#f97316"/><path d="M300 600 L350 500 L450 500 L500 600" fill="#f97316" opacity="0.5"/>`,
    overlay: GRIDS.noise
  },
  't47': { // Transhumanism
    bgGradient: ['#000', '#1e1b4b'],
    accentColor: '#22d3ee',
    shapes: `<circle cx="400" cy="300" r="100" fill="none" stroke="#22d3ee" stroke-width="2"/><rect x="350" y="280" width="100" height="40" fill="#000" stroke="#22d3ee"/><circle cx="300" cy="300" r="5" fill="#22d3ee"/><line x1="300" y1="300" x2="350" y2="300" stroke="#22d3ee"/>`,
    overlay: GRIDS.circuit
  },

  // --- ESOTERIC ---
  't3': { // Reptilians
    bgGradient: ['#022c22', '#064e3b'],
    accentColor: '#4ade80',
    shapes: `<path d="M200 300 Q400 100 600 300 Q400 500 200 300 Z" fill="#065f46"/><ellipse cx="400" cy="300" rx="30" ry="100" fill="#000"/><ellipse cx="400" cy="300" rx="10" ry="80" fill="#facc15" filter="url(#glow-t3)"/><path d="M250 200 Q400 150 550 200" stroke="#064e3b" stroke-width="5" fill="none"/>`,
    overlay: GRIDS.hex
  },
  't10': { // Hollow Earth
    bgGradient: ['#000', '#1c1917'],
    accentColor: '#fbbf24',
    shapes: `<circle cx="400" cy="300" r="250" fill="#1c1917" stroke="#444" stroke-width="2"/><circle cx="400" cy="300" r="100" fill="#f59e0b" filter="url(#glow-t10)"/><path d="M400 50 L400 150 M400 450 L400 550" stroke="#444" stroke-width="2" stroke-dasharray="5 5"/>`,
    overlay: GRIDS.polar
  },
  't22': { // Simulation
    bgGradient: ['#000', '#022c22'],
    accentColor: '#22c55e',
    shapes: `<rect x="300" y="200" width="200" height="200" fill="none" stroke="#22c55e" stroke-width="2"/><line x1="300" y1="200" x2="500" y2="400" stroke="#22c55e" stroke-width="1"/><line x1="500" y1="200" x2="300" y2="400" stroke="#22c55e" stroke-width="1"/><rect x="0" y="0" width="800" height="600" fill="url(#p-matrix)" opacity="0.3"/>`,
    overlay: GRIDS.matrix
  },
  't15': { // Remote Viewing
    bgGradient: ['#2e1065', '#000'],
    accentColor: '#d8b4fe',
    shapes: `<circle cx="400" cy="300" r="50" fill="#d8b4fe" filter="url(#glow-t15)"/><path d="M300 300 Q100 100 50 300" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.5"/><path d="M500 300 Q700 500 750 300" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.5"/><circle cx="400" cy="300" r="150" fill="none" stroke="#a855f7" stroke-width="1" stroke-dasharray="10 20"/>`,
    overlay: GRIDS.waves
  },
  't28': { // Nibiru
    bgGradient: ['#450a0a', '#000'],
    accentColor: '#ef4444',
    shapes: `<circle cx="200" cy="200" r="150" fill="#7f1d1d"/><circle cx="600" cy="500" r="50" fill="#1e3a8a"/><path d="M200 200 L600 500" stroke="#ef4444" stroke-width="2" stroke-dasharray="10 5" opacity="0.5"/>`,
    overlay: GRIDS.dots
  },
  't38': { // Nordics
    bgGradient: ['#e0f2fe', '#bae6fd'],
    accentColor: '#0ea5e9',
    shapes: `<circle cx="400" cy="300" r="100" fill="#fff" filter="url(#glow-t38)"/><path d="M300 500 L400 300 L500 500" fill="none" stroke="#0ea5e9" stroke-width="2"/>`,
    overlay: GRIDS.waves
  },
  't39': { // Vril
    bgGradient: ['#000', '#1c1917'],
    accentColor: '#a855f7',
    shapes: `<path d="M400 200 L500 400 L300 400 Z" fill="none" stroke="#a855f7" stroke-width="5"/><circle cx="400" cy="350" r="20" fill="#a855f7" filter="url(#glow-t39)"/>`,
    overlay: GRIDS.hex
  },
  't40': { // Draconians
    bgGradient: ['#064e3b', '#000'],
    accentColor: '#ef4444',
    shapes: `<path d="M300 200 Q400 100 500 200 L450 400 L350 400 Z" fill="#065f46" stroke="#ef4444" stroke-width="2"/><circle cx="380" cy="250" r="5" fill="#ef4444"/><circle cx="420" cy="250" r="5" fill="#ef4444"/>`,
    overlay: GRIDS.checkers
  },
  't57': { // Akasha
    bgGradient: ['#4c1d95', '#1e1b4b'],
    accentColor: '#c084fc',
    shapes: `<rect x="100" y="100" width="600" height="400" fill="none" stroke="#c084fc" stroke-width="1"/><line x1="100" y1="200" x2="700" y2="200" stroke="#c084fc" stroke-width="1"/><line x1="100" y1="300" x2="700" y2="300" stroke="#c084fc" stroke-width="1"/>`,
    overlay: GRIDS.waves
  },
  't29': { // Fluoride
    bgGradient: ['#0e7490', '#155e75'],
    accentColor: '#67e8f9',
    shapes: `<path d="M300 300 Q400 200 500 300" stroke="#67e8f9" stroke-width="5" fill="none"/><circle cx="400" cy="250" r="20" fill="#fff" filter="url(#glow-t29)"/>`,
    overlay: GRIDS.dots
  },
  't48': { // Plandemic
    bgGradient: ['#000', '#111'],
    accentColor: '#10b981',
    shapes: `<circle cx="400" cy="300" r="100" fill="none" stroke="#10b981" stroke-width="5" stroke-dasharray="10 10"/><line x1="300" y1="300" x2="500" y2="300" stroke="#10b981"/><line x1="400" y1="200" x2="400" y2="400" stroke="#10b981"/>`,
    overlay: GRIDS.matrix
  },

  // --- MODERN MYTHS ---
  't8': { // Bielefeld
    bgGradient: ['#f1f5f9', '#cbd5e1'],
    accentColor: '#64748b',
    shapes: `<rect x="200" y="200" width="400" height="200" fill="none" stroke="#64748b" stroke-width="4" stroke-dasharray="20 20"/><line x1="200" y1="200" x2="600" y2="400" stroke="#64748b" stroke-width="2"/><line x1="600" y1="200" x2="200" y2="400" stroke="#64748b" stroke-width="2"/><text x="400" y="310" text-anchor="middle" font-family="sans-serif" font-size="40" fill="#94a3b8">404</text>`,
    overlay: GRIDS.checkers
  },
  't13': { // MJ-12
    bgGradient: ['#000', '#1c1917'],
    accentColor: '#a3e635',
    shapes: `<rect x="300" y="200" width="200" height="250" fill="#1c1917" stroke="#a3e635" stroke-width="2"/><text x="400" y="300" text-anchor="middle" fill="#a3e635" font-family="monospace">TOP SECRET</text><text x="400" y="350" text-anchor="middle" fill="#a3e635" font-family="monospace" font-size="40">MJ-12</text>`,
    overlay: GRIDS.standard
  },
  't25': { // Denver Airport
    bgGradient: ['#1e3a8a', '#1e40af'],
    accentColor: '#ef4444',
    shapes: `<path d="M200 400 L400 100 L600 400 Z" fill="#fff" stroke="#000"/><circle cx="400" cy="300" r="20" fill="none" stroke="#ef4444" stroke-width="5"/><path d="M350 500 L450 500" stroke="#000" stroke-width="10"/>`,
    overlay: GRIDS.standard
  },
  't31': { // Bigfoot
    bgGradient: ['#064e3b', '#022c22'],
    accentColor: '#3f6212',
    shapes: `<path d="M0 600 L200 400 L400 500 L600 350 L800 600 Z" fill="#14532d"/><rect x="550" y="300" width="40" height="80" fill="#000" opacity="0.8" rx="10"/><circle cx="560" cy="310" r="2" fill="red" opacity="0.5"/><circle cx="580" cy="310" r="2" fill="red" opacity="0.5"/>`,
    overlay: GRIDS.noise
  },
  't32': { // Loch Ness
    bgGradient: ['#0c4a6e', '#082f49'],
    accentColor: '#0ea5e9',
    shapes: `<path d="M0 400 Q200 380 400 400 T800 400 L800 600 L0 600 Z" fill="#0369a1"/><path d="M300 400 Q350 300 400 350 Q450 400 500 400" stroke="#000" stroke-width="20" fill="none" opacity="0.6"/>`,
    overlay: GRIDS.waves
  },
  't33': { // Yeti
    bgGradient: ['#fff', '#e5e5e5'],
    accentColor: '#94a3b8',
    shapes: `<path d="M0 600 L400 100 L800 600 Z" fill="#f3f4f6"/><path d="M400 100 L500 600 L300 600 Z" fill="#e5e5e5" opacity="0.5"/><circle cx="450" cy="300" r="10" fill="#94a3b8" opacity="0.3"/>`,
    overlay: GRIDS.noise
  },
  't37': { // Greys
    bgGradient: ['#000', '#111'],
    accentColor: '#a3a3a3',
    shapes: `<path d="M300 200 Q400 100 500 200 Q550 400 400 500 Q250 400 300 200 Z" fill="#404040"/><ellipse cx="350" cy="300" rx="30" ry="15" fill="#000" transform="rotate(30 350 300)"/><ellipse cx="450" cy="300" rx="30" ry="15" fill="#000" transform="rotate(-30 450 300)"/>`,
    overlay: GRIDS.standard
  },
  't41': { // MIB
    bgGradient: ['#000', '#111'],
    accentColor: '#fff',
    shapes: `<rect x="300" y="100" width="200" height="400" fill="#000"/><rect x="350" y="150" width="100" height="20" fill="#fff" opacity="0.8"/><rect x="380" y="180" width="40" height="10" fill="#000"/>`,
    overlay: GRIDS.standard
  },
  't42': { // Area 51
    bgGradient: ['#c2410c', '#431407'],
    accentColor: '#fbbf24',
    shapes: `<path d="M0 600 L300 400 L500 450 L800 300 L800 600 Z" fill="#7c2d12"/><rect x="350" y="380" width="100" height="20" fill="#000"/><text x="400" y="395" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">RESTRICTED</text><path d="M200 100 L250 200 L300 100" fill="none" stroke="#fff" stroke-width="2"/><circle cx="250" cy="150" r="5" fill="#fff" filter="url(#glow-t42)"/>`,
    overlay: GRIDS.hex
  },
  't44': { // Philadelphia
    bgGradient: ['#1e40af', '#1e3a8a'],
    accentColor: '#60a5fa',
    shapes: `<rect x="200" y="300" width="400" height="100" fill="#1e3a8a" opacity="0.5"/><rect x="250" y="250" width="50" height="50" fill="#60a5fa" opacity="0.3"/><rect x="500" y="250" width="50" height="50" fill="#60a5fa" opacity="0.3"/><path d="M0 0 L800 600" stroke="#60a5fa" stroke-width="2" stroke-dasharray="20 20" opacity="0.5"/>`,
    overlay: GRIDS.matrix
  },
  't52': { // Bermuda
    bgGradient: ['#1e3a8a', '#172554'],
    accentColor: '#60a5fa',
    shapes: `<path d="M100 100 L700 100 L400 500 Z" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.8"/><circle cx="400" cy="300" r="100" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="5 5"/><rect x="380" y="250" width="40" height="40" fill="#000" transform="rotate(45 400 270)"/>`,
    overlay: GRIDS.waves
  },
  't55': { // Tunguska
    bgGradient: ['#7f1d1d', '#450a0a'],
    accentColor: '#fca5a5',
    shapes: `<circle cx="400" cy="300" r="50" fill="#fca5a5" filter="url(#glow-t55)"/><line x1="400" y1="300" x2="0" y2="0" stroke="#fca5a5" opacity="0.5"/><line x1="400" y1="300" x2="800" y2="0" stroke="#fca5a5" opacity="0.5"/>`,
    overlay: GRIDS.noise
  },

  // --- PSEUDOSCIENCE ---
  't11': { // Younger Dryas
    bgGradient: ['#0f172a', '#334155'],
    accentColor: '#fca5a5',
    shapes: `<circle cx="400" cy="600" r="300" fill="#1e293b"/><path d="M0 0 L300 300" stroke="#fca5a5" stroke-width="4" filter="url(#glow-t11)"/><circle cx="300" cy="300" r="20" fill="#fff" filter="url(#glow-t11)"/><path d="M250 250 L280 280 M220 220 L240 240" stroke="#fff" stroke-width="2"/>`,
    overlay: GRIDS.dots
  },
  't6': { // 5G
    bgGradient: ['#111', '#222'],
    accentColor: '#22c55e',
    shapes: `<path d="M400 600 L400 200" stroke="#444" stroke-width="5"/><circle cx="400" cy="200" r="5" fill="#fff"/><path d="M350 200 Q400 150 450 200" fill="none" stroke="#22c55e" stroke-width="3" class="animate-pulse"/><path d="M320 200 Q400 100 480 200" fill="none" stroke="#22c55e" stroke-width="3" opacity="0.6"/><path d="M290 200 Q400 50 510 200" fill="none" stroke="#22c55e" stroke-width="3" opacity="0.3"/>`,
    overlay: GRIDS.circuit
  },
  't12': { // Electric Universe
    bgGradient: ['#172554', '#1e3a8a'],
    accentColor: '#60a5fa',
    shapes: `<path d="M100 300 L300 100 L500 500 L700 300" fill="none" stroke="#60a5fa" stroke-width="5" filter="url(#glow-t12)"/><circle cx="300" cy="100" r="10" fill="#fff"/><circle cx="500" cy="500" r="10" fill="#fff"/>`,
    overlay: GRIDS.circuit
  },
  't14': { // Blue Beam
    bgGradient: ['#000', '#1e3a8a'],
    accentColor: '#38bdf8',
    shapes: `<path d="M400 50 L200 600 L600 600 Z" fill="url(#grad-radial-white)" opacity="0.3"/><rect x="380" y="40" width="40" height="20" fill="#fff"/><path d="M0 200 Q400 150 800 200" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.5"/>`,
    overlay: GRIDS.hex
  },
  't19': { // Ancient Aliens
    bgGradient: ['#78350f', '#451a03'],
    accentColor: '#fbbf24',
    shapes: `<path d="M200 500 L400 200 L600 500 Z" fill="#92400e"/><circle cx="400" cy="150" r="30" fill="#fbbf24" opacity="0.5" filter="url(#glow-t19)"/><path d="M100 100 L200 200" stroke="#fff" stroke-width="2" stroke-dasharray="10 10"/>`,
    overlay: GRIDS.dots
  },
  't21': { // HAARP
    bgGradient: ['#020617', '#1e293b'],
    accentColor: '#38bdf8',
    shapes: `<line x1="100" y1="500" x2="100" y2="400" stroke="#94a3b8" stroke-width="2"/><line x1="200" y1="500" x2="200" y2="400" stroke="#94a3b8" stroke-width="2"/><line x1="300" y1="500" x2="300" y2="400" stroke="#94a3b8" stroke-width="2"/><path d="M50 300 Q400 100 750 300" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.5" class="animate-pulse"/>`,
    overlay: GRIDS.waves
  },
  't50': { // Giza Death Star
    bgGradient: ['#000', '#1c1917'],
    accentColor: '#ef4444',
    shapes: `<path d="M300 500 L400 300 L500 500 Z" fill="#1c1917" stroke="#ef4444" stroke-width="2"/><line x1="400" y1="300" x2="400" y2="50" stroke="#ef4444" stroke-width="5" filter="url(#glow-t50)"/><circle cx="400" cy="300" r="10" fill="#fff"/>`,
    overlay: GRIDS.circuit
  },
  't56': { // Pole Shift
    bgGradient: ['#1e40af', '#1e3a8a'],
    accentColor: '#fff',
    shapes: `<circle cx="400" cy="300" r="200" fill="none" stroke="#fff" stroke-width="2"/><line x1="400" y1="100" x2="400" y2="500" stroke="#ef4444" stroke-width="4" transform="rotate(45 400 300)"/><text x="550" y="150" font-family="monospace" fill="#ef4444" font-size="20">ERROR</text>`,
    overlay: GRIDS.polar
  },

  // --- MEDIA ---
  'm1': { // The Matrix
    bgGradient: ['#000', '#022c22'],
    accentColor: '#4ade80',
    shapes: `<rect x="0" y="0" width="800" height="600" fill="url(#p-matrix)"/><text x="400" y="300" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="40" fill="#fff" letter-spacing="10" opacity="0.8">SYSTEM FAILURE</text><path d="M0 300 H800" stroke="#4ade80" stroke-width="1" opacity="0.5"/>`,
    overlay: GRIDS.matrix
  },
  'm2': { // X-Files
    bgGradient: ['#0f172a', '#000'],
    accentColor: '#22c55e',
    shapes: `<line x1="200" y1="100" x2="600" y2="500" stroke="#ef4444" stroke-width="20" opacity="0.8"/><line x1="600" y1="100" x2="200" y2="500" stroke="#ef4444" stroke-width="20" opacity="0.8"/><circle cx="400" cy="300" r="100" fill="none" stroke="#fff" stroke-width="2"/><text x="400" y="550" text-anchor="middle" font-family="monospace" fill="#fff" font-size="20">THE TRUTH IS OUT THERE</text>`,
    overlay: GRIDS.noise
  },
  'm3': { // Deus Ex
    bgGradient: ['#000', '#1c1917'],
    accentColor: '#fbbf24',
    shapes: `<path d="M100 100 L200 100 L150 200 Z" fill="#fbbf24"/><path d="M600 100 L700 100 L650 200 Z" fill="#fbbf24"/><path d="M0 400 L800 400" stroke="#fbbf24" stroke-width="1"/><rect x="200" y="250" width="400" height="100" fill="none" stroke="#fbbf24" stroke-width="1" stroke-dasharray="10 5"/>`,
    overlay: GRIDS.hex
  },
  'm4': { // They Live
    bgGradient: ['#fff', '#000'],
    accentColor: '#000',
    shapes: `<rect x="0" y="0" width="400" height="600" fill="#fff"/><rect x="400" y="0" width="400" height="600" fill="#000"/><text x="200" y="300" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="60" fill="#000">OBEY</text><text x="600" y="300" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="60" fill="#fff">CONSUME</text>`,
    overlay: GRIDS.standard
  },
  'm25': { // Inside Job
    bgGradient: ['#312e81', '#4c1d95'],
    accentColor: '#d8b4fe',
    shapes: `<path d="M400 100 L600 200 L600 400 L400 500 L200 400 L200 200 Z" fill="none" stroke="#fff" stroke-width="4"/><circle cx="400" cy="300" r="50" fill="#d8b4fe" filter="url(#glow-m25)"/><path d="M400 300 L600 200" stroke="#fff" stroke-width="2" stroke-dasharray="5 5"/><path d="M400 300 L200 200" stroke="#fff" stroke-width="2" stroke-dasharray="5 5"/>`,
    overlay: GRIDS.circuit
  },
  'm5': { // Illuminatus
    bgGradient: ['#fef08a', '#fbbf24'],
    accentColor: '#000',
    shapes: `<path d="M400 100 L600 500 L200 500 Z" fill="none" stroke="#000" stroke-width="10"/><circle cx="400" cy="350" r="40" fill="#000"/><circle cx="400" cy="350" r="10" fill="#fff"/><text x="400" y="580" text-anchor="middle" font-family="serif" font-size="30" fill="#000">FNORD</text>`,
    overlay: GRIDS.checkers
  }
};

export const generateArt = (id: string, category: string, title: string): string => {
  // 1. Check if we have a specific manual config
  let config = THEORY_ART_CONFIG[id];

  // 2. If not, generate a robust procedural config
  if (!config) {
    config = generateProceduralConfig(id, title + category);
  }

  const overlayId = config.overlay.match(/id="([^"]+)"/)?.[1] || 'p-grid';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg-${escapeXML(id)}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${config.bgGradient[0]}" />
          <stop offset="100%" stop-color="${config.bgGradient[1]}" />
        </linearGradient>
        <filter id="glow-${escapeXML(id)}">
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
        ${config.overlay}
      </defs>
      
      <rect width="800" height="600" fill="url(#bg-${escapeXML(id)})" />
      
      ${config.shapes}
      
      <!-- Scanlines / Grain Overlay -->
      <rect width="100%" height="100%" fill="url(#${overlayId})" opacity="0.1" pointer-events="none"/>
      
      <!-- Vignette -->
      <radialGradient id="vignette-${escapeXML(id)}">
        <stop offset="50%" stop-color="transparent"/>
        <stop offset="100%" stop-color="black" stop-opacity="0.6"/>
      </radialGradient>
      <rect width="100%" height="100%" fill="url(#vignette-${escapeXML(id)})" pointer-events="none"/>
      
      <!-- Title (Subtle watermark) -->
      <text x="20" y="580" font-family="monospace" font-size="10" fill="white" opacity="0.3">ID: ${escapeXML(id.toUpperCase())} // CAT: ${escapeXML(category.toUpperCase())}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${utf8_to_b64(svg)}`;
};
