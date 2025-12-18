/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Rate Limiting Utilities for Frontend
 * Prevents abuse and protects API quotas
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry>;
  private config: RateLimitConfig;
  private cleanupIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(config: RateLimitConfig) {
    this.limits = new Map();
    this.config = config;
    this.cleanup();
  }

  /**
   * Check if action is allowed
   */
  isAllowed(key: string = 'default'): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    // No entry yet or window expired
    if (!entry || now >= entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    // Within window, check count
    if (entry.count < this.config.maxRequests) {
      entry.count++;
      return true;
    }

    // Rate limit exceeded
    return false;
  }

  /**
   * Get remaining requests
   */
  getRemaining(key: string = 'default'): number {
    const entry = this.limits.get(key);
    if (!entry || Date.now() >= entry.resetTime) {
      return this.config.maxRequests;
    }
    return Math.max(0, this.config.maxRequests - entry.count);
  }

  /**
   * Get reset time
   */
  getResetTime(key: string = 'default'): number | null {
    const entry = this.limits.get(key);
    if (!entry) return null;
    return entry.resetTime;
  }

  /**
   * Reset limits for a key
   */
  reset(key: string = 'default'): void {
    this.limits.delete(key);
  }

  /**
   * Cleanup expired entries periodically
   */
  private cleanup(): void {
    // Clear any existing interval to prevent multiple intervals
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
    }

    this.cleanupIntervalId = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.limits.entries()) {
        if (now >= entry.resetTime) {
          this.limits.delete(key);
        }
      }
    }, this.config.windowMs);
  }

  /**
   * Destroy the rate limiter and cleanup resources
   */
  destroy(): void {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
    }
    this.limits.clear();
  }
}

// Default rate limiters for different operations
export const conversionRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000, // 5 requests per minute
  message: 'Too many conversion requests. Please wait a moment and try again.',
});

export const loginRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 5 attempts per 15 minutes
  message: 'Too many login attempts. Please wait 15 minutes and try again.',
});

export const uploadRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 uploads per minute
  message: 'Too many upload attempts. Please wait a moment and try again.',
});

/**
 * Format time until reset
 */
export const formatResetTime = (resetTime: number): string => {
  const now = Date.now();
  const diff = resetTime - now;

  if (diff <= 0) return 'now';

  const seconds = Math.ceil(diff / 1000);
  const minutes = Math.floor(seconds / 60);

  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
};
