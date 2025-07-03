export function generateExcerpt(content: string, maxLength = 140): string {
  if (!content) return '';

  let text = content
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/(script|style)>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const lines = text.split('\n').filter((l) => l.trim());
  if (lines.length > 1 && lines[0].length < 80 && !/[.!?]$/.test(lines[0])) {
    text = lines.slice(1).join(' ');
  }

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  let result = '';

  for (const sentence of sentences) {
    const clean = sentence.trim();
    if (result.length + clean.length > maxLength) break;
    result += (result ? '. ' : '') + clean;
    if (result.length >= maxLength * 0.8) break;
  }

  if (!result) {
    result = text.slice(0, maxLength).trim();
    if (!/[.!?]$/.test(result)) result += '...';
  }

  return result;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadingTime(
  content: string,
  wordsPerMinute = 200,
): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
