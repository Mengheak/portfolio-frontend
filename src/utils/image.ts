export function getImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return import.meta.env.VITE_BASE_URL + url;
}
