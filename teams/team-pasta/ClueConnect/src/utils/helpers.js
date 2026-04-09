/**
 * Format seconds as MM:SS
 */
export function formatTime(seconds) {
  const m = Math.floor(Math.abs(seconds) / 60).toString().padStart(2, '0');
  const s = (Math.abs(seconds) % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncate(text, maxLength = 80) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/**
 * Generate a unique ID with optional prefix.
 */
export function uid(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Returns a colour class string based on difficulty label.
 */
export function difficultyColor(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10';
    case 'intermediate': return 'text-amber-400 border-amber-400/40 bg-amber-400/10';
    case 'hard': return 'text-red-400 border-red-400/40 bg-red-400/10';
    default: return 'text-slate-400 border-slate-400/40 bg-slate-400/10';
  }
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
