# Authrix Authentication SDK

Authentication SDK with React hooks, automatic token refresh, and comprehensive error handling.

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
yarn add authrix-sdk
# or
bun install authrix-sdk
```

## Quick Start

### 1. Initialize the Client

```typescript
import { AuthClient, AuthProvider } from 'authrix-sdk';

const authClient = new AuthClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-api-url.com'
});

// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider client={authClient}>
      <YourApp />
    </AuthProvider>
  );
}
```

### 2. Use Authentication Hooks

```typescript
import { useAuth } from 'authrix-sdk';

function LoginComponent() {
  const { login, register, user, loading, logout } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({ 
        email: 'user@example.com', 
        password: 'password' 
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  const handleRegister = async () => {
    try {
      await register({
        email: 'user@example.com',
        password: 'password',
        username: 'username'
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.username || user.email}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### AuthClient

```typescript
const client = new AuthClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-api-url.com', // optional, defaults to localhost:3000
  timeout: 10000, // optional, request timeout in ms
  retries: 3 // optional, number of retries for failed requests
});
```

### useAuth Hook

```typescript
const {
  user,           // Current user object or null
  loading,        // Loading state
  login,          // Login function
  register,       // Register function  
  logout,         // Logout function
  logoutAll,      // Logout from all devices
  isAuthenticated // Boolean authentication status
} = useAuth();
```

### Methods

#### login(credentials)
```typescript
await login({
  email: 'user@example.com',
  password: 'password'
});
```

#### register(userData)
```typescript
await register({
  email: 'user@example.com',
  password: 'password',
  username: 'username'
});
```

#### logout()
```typescript
await logout(); // Logout from current device
```

#### logoutAll()
```typescript
await logoutAll(); // Logout from all devices
```

### Password Reset

```typescript
// Request password reset (server will send email with code)
await client.requestPasswordReset('user@example.com');

// Reset password with code from email
await client.resetPassword('123456', 'newPassword');
```

## Configuration

```typescript
interface AuthConfig {
  apiKey: string;        // Your application API key
  baseUrl?: string;      // API base URL (optional)
  timeout?: number;      // Request timeout in milliseconds (optional)
  retries?: number;      // Number of retries for failed requests (optional)
}
```

## Error Handling

The SDK throws descriptive errors that you can catch and handle:

```typescript
try {
  await login({ email: 'user@example.com', password: 'wrong' });
} catch (error) {
  if (error.message.includes('Invalid credentials')) {
    // Handle invalid login
  } else if (error.message.includes('verify')) {
    // Handle email verification required
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import type { User, AuthResponse, LoginData, RegisterData } from 'authrix-sdk';
```

## License

MIT
