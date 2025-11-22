# Auth SDK

## Installation
```bash
bun install
```

## Usage
```typescript
import AuthSDK from './index';

const auth = new AuthSDK({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  baseUrl: 'http://localhost:8000' // optional
});

// Register
const user = await auth.register({
  email: 'user@example.com',
  password: 'password123',
  username: 'johndoe'
});

// Login
const session = await auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Refresh token
const newTokens = await auth.refreshToken('refresh-token');

// Logout
await auth.logout('refresh-token');
```
