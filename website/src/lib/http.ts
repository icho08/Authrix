import { AUTHRIX_API_KEY, AUTHRIX_BASE_URL } from './env';

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  accessToken?: string;
};

export async function requestJson<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  if (!AUTHRIX_API_KEY) {
    throw new Error('Missing VITE_AUTHRIX_API_KEY. Create website/.env from .env.example');
  }

  const res = await fetch(`${AUTHRIX_BASE_URL}${path}`, {
    method: opts.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTHRIX_API_KEY,
      ...(opts.accessToken ? { Authorization: `Bearer ${opts.accessToken}` } : {}),
      ...(opts.headers ?? {})
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      (data && (data.error || data.message)) ||
      `HTTP ${res.status} (${res.statusText})`;
    throw new HttpError(res.status, String(message));
  }

  return (await res.json()) as T;
}
