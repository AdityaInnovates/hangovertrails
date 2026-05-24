type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string, maxAttempts: number, windowMinutes: number) {
  const now = Date.now();
  const resetAt = now + windowMinutes * 60 * 1000;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxAttempts - 1, resetAt };
  }

  if (current.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  buckets.set(key, current);

  return { allowed: true, remaining: maxAttempts - current.count, resetAt: current.resetAt };
}