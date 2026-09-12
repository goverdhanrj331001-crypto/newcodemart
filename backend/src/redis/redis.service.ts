import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

/**
 * Thin wrapper around ioredis with safe JSON helpers used across the app:
 *   - get/set/del with JSON auto-serialisation
 *   - cache-aside pattern (`getOrSet`)
 *   - cart storage (hash)
 *   - rate-limit counters
 *
 * All operations gracefully degrade to "no-op / cache miss" when Redis is
 * unreachable — the app still works (just slower) when Redis is down.
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger('Redis');
  private readonly available = true;

  constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {
    client.on('error', (e) => this.logger.warn(`redis error: ${e.message}`));
  }

  get raw(): Redis {
    return this.client;
  }

  private async safe<T>(op: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await op();
    } catch (e: any) {
      this.logger.warn(`redis op failed: ${e.message}`);
      return fallback;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialised = JSON.stringify(value);
    if (ttlSeconds && ttlSeconds > 0) {
      await this.safe(() => this.client.set(key, serialised, 'EX', ttlSeconds), 'OK' as any);
    } else {
      await this.safe(() => this.client.set(key, serialised), 'OK' as any);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const raw = await this.safe(() => this.client.get(key), null as any);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  async del(key: string | string[]): Promise<number> {
    if (Array.isArray(key)) return this.safe(() => this.client.del(...key), 0);
    return this.safe(() => this.client.del(key), 0);
  }

  async exists(key: string): Promise<boolean> {
    const r = await this.safe(() => this.client.exists(key), 0);
    return r === 1;
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const r = await this.safe(() => this.client.expire(key, ttlSeconds), 0);
    return r === 1;
  }

  async incr(key: string, ttlSeconds?: number): Promise<number> {
    const value = await this.safe(() => this.client.incr(key), 0);
    if (value === 1 && ttlSeconds) await this.safe(() => this.client.expire(key, ttlSeconds), 0);
    return value;
  }

  /**
   * Cache-aside helper. If `key` is set, returns cached value; otherwise
   * calls `factory`, caches the result with `ttlSeconds`, and returns it.
   *
   * Falls back to calling `factory` directly on Redis failure.
   */
  async getOrSet<T>(key: string, ttlSeconds: number, factory: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const fresh = await factory();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }

  // ---- Hash helpers (used by cart module) ----

  async hset(name: string, field: string, value: unknown): Promise<number> {
    return this.safe(() => this.client.hset(name, field, JSON.stringify(value)), 0);
  }

  async hget<T = any>(name: string, field: string): Promise<T | null> {
    const raw = await this.safe(() => this.client.hget(name, field), null as any);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  async hgetall<T = any>(name: string): Promise<Record<string, T>> {
    const obj = await this.safe(() => this.client.hgetall(name), {} as any);
    const out: Record<string, T> = {};
    for (const k of Object.keys(obj || {})) {
      try {
        out[k] = JSON.parse(obj[k]);
      } catch {
        out[k] = obj[k] as unknown as T;
      }
    }
    return out;
  }

  async hdel(name: string, ...fields: string[]): Promise<number> {
    return this.safe(() => this.client.hdel(name, ...fields), 0);
  }

  async hlen(name: string): Promise<number> {
    return this.safe(() => this.client.hlen(name), 0);
  }

  async delKey(name: string): Promise<number> {
    return this.safe(() => this.client.del(name), 0);
  }

  // ---- Lifecycle ----

  async onModuleDestroy(): Promise<void> {
    if (this.client.status !== 'end') {
      await this.client.quit().catch(() => undefined);
    }
  }
}
