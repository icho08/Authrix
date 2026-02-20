import CodeBlock from "../../components/CodeBlock";

export default function ReactHooks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-4">React Hooks</h1>
        <p className="text-muted-foreground mb-6">
          Use the useAuth hook for seamless authentication state management in
          React components.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">useAuth Hook</h2>
        <CodeBlock>
          {`import { useAuth } from 'authrix-sdk';

function MyComponent() {
  const {
    user,           // Current user profile or null
    loading,        // Authentication loading state
    login,          // Login method (data: LoginData)
    register,       // Registration method (data: RegisterData)
    logout,         // Logout from current session
    logoutAll,      // Logout from all active sessions
    isAuthenticated // Client-side authentication status
  } = useAuth();
}`}
        </CodeBlock>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">AuthProvider</h2>
        <p className="text-muted-foreground mb-3">
          Wrap your app with AuthProvider to enable authentication context.
        </p>
        <CodeBlock>
          {`import { AuthProvider, AuthClient } from 'authrix-sdk';

const client = new AuthClient({
  apiKey: 'your-api-key', 
  baseUrl : ${import.meta.env.VITE_API_BASE_URL}
});

function App() {
  return (
    <AuthProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}`}
        </CodeBlock>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Complete Example</h2>
        <CodeBlock>
          {`import { useAuth } from 'authrix-sdk';
import { useState } from 'react';

function AuthComponent() {
  const { user, login, register, logout, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ email, password, username });
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.username || user.email}!</h1>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      <button type="button" onClick={handleRegister}>
        Register
      </button>
    </form>
  );
}`}
        </CodeBlock>
      </div>
    </div>
  );
}
