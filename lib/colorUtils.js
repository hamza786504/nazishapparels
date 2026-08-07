// Resolve an admin-typed color label (e.g. "Emerald Green", "Wine", "Navy Blue")
// to a concrete CSS color string for swatches. Falls back to the nearest known
// color, then to a neutral gray, so a swatch is ALWAYS filled even when the label
// isn't a valid CSS color. Pure client-side helper (no server deps).

// Curated palette of common apparel color names → hex. Keys are normalized
// (lowercase, spaces trimmed) so lookup is fast and deterministic.
const COLOR_PALETTE = {
  black: '#1a1a1a',
  'jet black': '#000000',
  'off black': '#2b2b2b',
  white: '#ffffff',
  'off white': '#fafafa',
  cream: '#f5f0e1',
  ivory: '#fffff0',
  beige: '#f5f5dc',
  'light beige': '#f0e6d3',
  sand: '#e6d7b8',
  tan: '#d2b48c',
  khaki: '#c3b091',
  'camel': '#c19a6b',
  brown: '#6f4e37',
  'dark brown': '#4a3728',
  'light brown': '#a9746f',
  chocolate: '#7b3f00',
  'coffee': '#6f4e37',
  taupe: '#8b8378',
  'mocha': '#a78a7f',
  'cappuccino': '#bfa37f',
  caramel: '#c68e17',
  'toffee': '#8b5a2b',
  maroon: '#800000',
  burgundy: '#800020',
  wine: '#722f37',
  'oxblood': '#4a0404',
  red: '#e53935',
  'bright red': '#ff0000',
  'dark red': '#8b0000',
  'brick red': '#b22222',
  rust: '#b7410e',
  'crimson': '#dc143c',
  'rose': '#e30b5c',
  'rose pink': '#f2a4a8',
  'blush': '#f4c2c2',
  'dusty pink': '#d8a2a6',
  'millennial pink': '#f7cac9',
  pink: '#f48fb1',
  'light pink': '#ffb6c1',
  'light skin': '#f3c7a8',
  'hot pink': '#ff1493',
  'neon pink': '#ff007f',
  magenta: '#d4147b',
  'fuchsia': '#c34f95',
  coral: '#ff7f50',
  'coral pink': '#f88379',
  peach: '#ffcba4',
  apricot: '#fbceb1',
  'salmon': '#fa8072',
  'baby pink': '#f8c8dc',
  orange: '#fb8c00',
  'bright orange': '#ff6600',
  'burnt orange': '#cc5500',
  tangerine: '#f28500',
  'dark orange': '#ff8c00',
  'light orange': '#ffd6a5',
  amber: '#ffbf00',
  yellow: '#fdd835',
  'bright yellow': '#ffd600',
  'mustard': '#e1ad01',
  'mustard yellow': '#d4af37',
  gold: '#d4a017',
  'golden': '#d4a017',
  'golden yellow': '#ffdf00',
  champagne: '#f7e7ce',
  'lemon': '#fff700',
  'neon yellow': '#ccff00',
  olive: '#808000',
  'olive green': '#556b2f',
  'military green': '#4b5320',
  'forest green': '#228b22',
  'dark green': '#1e5631',
  'emerald': '#50c878',
  'emerald green': '#046307',
  'deep emerald': '#046307',
  green: '#4caf50',
  'bright green': '#00ff00',
  'lime green': '#32cd32',
  lime: '#aeea00',
  'mint green': '#98ff98',
  mint: '#a6d8b5',
  pistachio: '#a8c686',
  pistache: '#a8c686',
  parrot: '#6a994e',
  'parrot green': '#6a994e',
  sage: '#9caf88',
  'sage green': '#9caf88',
  'seafoam': '#c8e0c8',
  teal: '#008080',
  'teal green': '#00827f',
  turquoise: '#40e0d0',
  'turquoise blue': '#00f5ff',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  cyan: '#00bcd4',
  blue: '#1e88e5',
  'bright blue': '#2196f3',
  'navy': '#000080',
  'navy blue': '#000080',
  'midnight blue': '#191970',
  'royal blue': '#4169e1',
  'cobalt blue': '#0047ab',
  'sky blue': '#87ceeb',
  'baby blue': '#89cff0',
  'light blue': '#add8e6',
  'powder blue': '#b0e0e6',
  'steel blue': '#4682b4',
  'denim': '#1565c0',
  'slate blue': '#6a5acd',
  'ice blue': '#99ffff',
  'periwinkle': '#ccccff',
  indigo: '#3f51b5',
  violet: '#7f00ff',
  purple: '#7b1fa2',
  'dark purple': '#4a148c',
  'deep purple': '#673ab7',
  lavender: '#b57edc',
  lilac: '#c8a2c8',
  plum: '#673147',
  mauve: '#b4829d',
  'wine purple': '#722f37',
  'eggplant': '#614051',
  gray: '#9e9e9e',
  grey: '#9e9e9e',
  'light gray': '#d3d3d3',
  'light grey': '#d3d3d3',
  'dark gray': '#424242',
  'dark grey': '#424242',
  charcoal: '#36454f',
  'charcoal gray': '#3b3b3b',
  'graphite': '#41424c',
  silver: '#c0c0c0',
  platinum: '#e5e4e2',
  'gunmetal': '#2a3439',
  'steel gray': '#71797e',
  'smoke': '#737373',
  'ash': '#b2beb5',
  'greige': '#b8a99a',
  // Typos / variant spellings observed in the dataset.
  'whtie': '#ffffff',
  'musters': '#e1ad01',
  'zink': '#aab0b8',
  'mongia': '#b08d57',
};

const FALLBACK_COLOR = '#c9c9c9';

// Returns true when `value` is already a parseable CSS color (hex/rgb/hsl or a
// native named color). Uses the DOM when available; regex-only otherwise.
function isCssColor(value) {
  const v = String(value).trim();
  if (!v) return false;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)) return true;
  if (/^(rgb|rgba|hsl|hsla)\(/.test(v)) return true;
  if (typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.style.color = v;
    if (el.style.color) {
      // Native color names (e.g. "rebeccapurple") parse but hex always round-trips.
      const probe = document.createElement('div');
      probe.style.color = '#000';
      return /^#/.test(el.style.color) || probe.style.color.length > 0;
    }
  }
  return false;
}

// Best effort: token-match a free-text label against the palette (e.g.
// "Emerald Green" → emerald green; "Sky Blue" → sky blue). Requires EVERY input
// token to be covered so "Light Pink" can't half-match "Light Beige".
function fuzzyMatch(normalized) {
  const tokens = normalized.split(/[\s-_]+/).filter(Boolean);
  if (tokens.length === 0) return null;
  let bestKey = null;
  let bestScore = -1;

  for (const [key] of Object.entries(COLOR_PALETTE)) {
    const keyTokens = key.split(/[\s-_]+/);
    let score = 0;
    let matchedAll = true;

    for (const t of tokens) {
      let tokenScore = 0;
      for (const kt of keyTokens) {
        let s = 0;
        if (kt === t) s = 1;
        else if (kt.startsWith(t) || t.startsWith(kt)) s = 0.5;
        else if (levenshtein(t, kt) <= 1) s = 0.75;
        if (s > tokenScore) tokenScore = s;
      }
      if (tokenScore === 0) {
        matchedAll = false;
        break;
      }
      score += tokenScore;
    }

    // Prefer full-token matches; then the tightest match among those.
    if (matchedAll && score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  if (bestKey) return COLOR_PALETTE[bestKey];
  return null;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

/**
 * Resolve any admin-typed color label to a concrete CSS color.
 * @param {string} value - label, hex, rgb, hsl, or native CSS color name.
 * @returns {string} a valid CSS color string (always defined).
 */
export function resolveColor(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return FALLBACK_COLOR;
  if (isCssColor(raw)) return raw;

  const normalized = raw.toLowerCase().replace(/\s+/g, ' ');
  if (COLOR_PALETTE[normalized]) return COLOR_PALETTE[normalized];

  const matched = fuzzyMatch(normalized);
  return matched || FALLBACK_COLOR;
}
