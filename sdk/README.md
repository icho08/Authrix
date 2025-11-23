# Authrix Authentication SDK

Production-ready authentication SDK with React hooks, automatic token refresh, rate limiting, and comprehensive error handling.

## Features

- 🔐 Complete authentication flow (login, register, logout, password reset)
- 🔄 Automatic token refresh with retry logic
- 🛡️ Built-in rate limiting and request retry
- ⚛️ React hooks for seamless integration
- 🍪 Secure cookie-based token storage
- 📝 Comprehensive TypeScript support
- 🔍 Configurable logging system

## Installation

```bash
npm install authrix-sdk
# or
bun install authrix-sdk
```

## Quick Start

```typescript
import { AuthClient, useAuth } from 'authrix-sdk';

// Initialize client
const authClient = new AuthClient({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  baseUrl: 'https://api.example.com'
});

// React Hook Usage
function LoginComponent() {
  const { login, user, loading, error } = useAuth();
  
  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password' });
  };
  
  return (
    <div>
      {user ? `Welcome ${user.email}` : 
        <button onClick={handleLogin}>Login</button>
      }
    </div>
  );
}
```

## API Reference

### AuthClient Methods

- `login(credentials)` - Authenticate user
- `register(userData)` - Create new account  
- `logout(type?)` - Sign out (current device or all devices)
- `refreshToken()` - Refresh access token
- `resetPassword(email)` - Send password reset email
- `verifyEmail(token)` - Verify email address

### Configuration Options

```typescript
interface AuthConfig {
  apiKey: string;
  secretKey: string;
  baseUrl?: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  rateLimitConfig?: {
    maxRequests: number;
    windowMs: number;
  };
}
```

## Testing

```bash
bun test
```

## Building

```bash
bun run build
```
