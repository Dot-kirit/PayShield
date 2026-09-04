export const extractUrlFromText = (text) => {
  if (!text || typeof text !== 'string') return null;

  // Matches http, https, and standalone domain formats
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  const matches = text.match(urlRegex);

  return matches && matches.length > 0 ? matches[0] : null;
};

export const sanitizeDomain = (url) => {
  if (!url) return '';
  try {
    const formatted = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(formatted);
    return parsed.hostname.replace('www.', '');
  } catch {
    return url.split('/')[0];
  }
};