/**
 * Normalize Indonesian phone numbers to international WhatsApp format (628xxx).
 * Returns empty string if input has no digits.
 */
export function normalizeIndonesianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }
  if (digits.startsWith('62')) {
    return digits;
  }
  if (digits.startsWith('8')) {
    return `62${digits}`;
  }
  return digits;
}

export function buildWhatsAppUrl(message: string, rawPhone?: string): string {
  const normalized = rawPhone ? normalizeIndonesianPhone(rawPhone) : '';
  const encodedText = encodeURIComponent(message.trim());
  if (normalized) {
    return `https://wa.me/${normalized}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}

export function countWordsAndChars(text: string): { words: number; chars: number } {
  const trimmed = text.trim();
  const chars = text.length;
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  return { words, chars };
}

export function getScoreDelta(latest: string, previous: string): {
  type: 'up' | 'down' | 'same' | null;
  label: string;
} {
  const latestNum = Number(latest.replace(',', '.').match(/-?\d+(\.\d+)?/)?.[0]);
  const prevNum = Number(previous.replace(',', '.').match(/-?\d+(\.\d+)?/)?.[0]);

  if (!latest.trim() || !previous.trim() || Number.isNaN(latestNum) || Number.isNaN(prevNum)) {
    return { type: null, label: '' };
  }

  const diff = Number((latestNum - prevNum).toFixed(1));
  if (diff > 0) {
    return { type: 'up', label: `Naik +${diff} poin` };
  }
  if (diff < 0) {
    return { type: 'down', label: `Turun ${diff} poin` };
  }
  return { type: 'same', label: 'Stabil (sama)' };
}

export function formatIndonesianDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}
