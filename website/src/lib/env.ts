export function getEnv(name: string): string | undefined {
  const value = (import.meta as any).env?.[name] as string | undefined;
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export const AUTHRIX_BASE_URL = getEnv('VITE_AUTHRIX_BASE_URL') ?? 'http://localhost:3000';
export const AUTHRIX_API_KEY = getEnv('VITE_AUTHRIX_API_KEY') ?? '';
