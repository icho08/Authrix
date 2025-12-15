import { requestJson } from './http';
import type { AuthResponse, Session, User } from './types';

export class AuthrixClient {
  async register(input: { email: string; password: string; username: string }): Promise<AuthResponse | { message: string; user: any }> {
    return requestJson('/api/auth/register', { method: 'POST', body: input });
  }

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    return requestJson('/api/auth/login', { method: 'POST', body: input });
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Server expects refresh token in Authorization header
    return requestJson('/api/auth/refresh', { method: 'POST', accessToken: refreshToken });
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    // Server expects refresh token in Authorization header
    return requestJson('/api/auth/logout', { method: 'POST', accessToken: refreshToken });
  }

  async getProfile(accessToken: string): Promise<User> {
    // Server returns profile object (not wrapped in {user})
    return requestJson('/api/auth/profile', { method: 'GET', accessToken });
  }

  async getSessions(accessToken: string): Promise<{ sessions: Session[] }> {
    return requestJson('/api/auth/sessions', { method: 'GET', accessToken });
  }

  async logoutAll(accessToken: string): Promise<{ message: string }> {
    return requestJson('/api/auth/logout-all', { method: 'POST', body: {}, accessToken });
  }
}
