/**
 * CodeMart API Client
 * ================
 * Thin wrapper around `fetch` that:
 *   - Auto-prefixes the API URL from env
 *   - Auto-attaches the Bearer access token (if logged in)
 *   - Unwraps the `{ success, data }` envelope from the backend
 *   - Falls back to provided `fallback` on error (so UI keeps working even
 *     if the backend is offline — useful for local dev / preview).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Auth token storage (client-side only)
const ACCESS_TOKEN_KEY = 'codemart_access_token';
const REFRESH_TOKEN_KEY = 'codemart_refresh_token';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
  message?: string;
  statusCode?: number;
}

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Core request function. Returns the unwrapped `data` field.
 */
export async function api<T = any>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body.message || msg;
    } catch {
      // ignore JSON parse error
    }
    // Auto-logout on 401
    if (res.status === 401 && typeof window !== 'undefined') {
      // Try refresh once, else clear tokens
      const refreshed = await tryRefresh();
      if (refreshed) return api<T>(path, init);
      clearTokens();
    }
    throw new ApiError(msg, res.status);
  }

  const body: ApiResponse<T> = await res.json();
  // Some endpoints (like /health/ping) don't wrap in envelope
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return body.data;
  }
  return body as unknown as T;
}

/**
 * Try to refresh the access token using the refresh token.
 * Returns true on success.
 */
let refreshing: Promise<boolean> | null = null;
export async function tryRefresh(): Promise<boolean> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (!res.ok) return false;
      const body = await res.json();
      const tokens = body.data || body;
      if (tokens?.accessToken && tokens?.refreshToken) {
        setTokens(tokens.accessToken, tokens.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

/**
 * "Safe" version of api() — never throws, returns fallback instead.
 * Use this for read endpoints where you want graceful degradation.
 */
export async function apiSafe<T>(path: string, fallback: T): Promise<T> {
  try {
    return await api<T>(path);
  } catch (e) {
    console.warn(`[api] ${path} failed, using fallback`, e);
    return fallback;
  }
}

// ---- Auth helpers ----

export async function login(email: string, password: string) {
  const result = await api<{ user: any; accessToken: string; refreshToken: string }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );
  setTokens(result.accessToken, result.refreshToken);
  return result;
}

export async function register(name: string, email: string, password: string) {
  const result = await api<{ user: any; accessToken: string; refreshToken: string }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    },
  );
  setTokens(result.accessToken, result.refreshToken);
  return result;
}

export async function logout() {
  try {
    await api('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    });
  } catch {
    // ignore
  }
  clearTokens();
}
