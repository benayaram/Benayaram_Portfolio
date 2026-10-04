export type ContactInput = { name: string; email: string; message: string; website: string };
export function validateContact(value: unknown): ContactInput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  if (!['name', 'email', 'message'].every((key) => typeof data[key] === 'string')) return null;
  if (data.website !== undefined && typeof data.website !== 'string') return null;
  const name = (data.name as string).trim(),
    email = (data.email as string).trim(),
    message = (data.message as string).trim();
  if (
    name.length < 2 ||
    name.length > 100 ||
    /[\r\n\0]/.test(name) ||
    email.length > 254 ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(email) ||
    /[\r\n\0]/.test(email) ||
    message.length < 10 ||
    message.length > 5000 ||
    message.includes('\0')
  )
    return null;
  return { name, email, message, website: (data.website as string | undefined)?.trim() ?? '' };
}
export class RateLimiter {
  private entries = new Map<string, { count: number; reset: number }>();
  private limit: number;
  private window: number;
  private maximumKeys: number;
  constructor(limit = 5, window = 600_000, maximumKeys = 2000) {
    this.limit = limit;
    this.window = window;
    this.maximumKeys = maximumKeys;
  }
  consume(key: string, now = Date.now()) {
    for (const [id, item] of this.entries) if (item.reset <= now) this.entries.delete(id);
    let item = this.entries.get(key);
    if (!item) {
      if (this.entries.size >= this.maximumKeys) return false;
      item = { count: 0, reset: now + this.window };
      this.entries.set(key, item);
    }
    if (item.count >= this.limit) return false;
    item.count++;
    return true;
  }
}
