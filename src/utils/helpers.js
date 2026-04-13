export const AVATAR_COLORS = [
  '#1a7a3c', '#0f4d25', '#2da55a', '#0d4d1a', '#1a5c2e', '#386641', '#116530'
];

export function getAvatarColor(name) {
  let h = 0;
  for (let c of (name || '')) {
    h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[h];
}

export function initials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export function timeAgo(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return Math.floor(d / 60) + 'm ago';
  if (d < 86400) return Math.floor(d / 3600) + 'h ago';
  return Math.floor(d / 86400) + 'd ago';
}

export function escHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
