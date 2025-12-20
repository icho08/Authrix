import CodeBlock from '../../components/CodeBlock'

export default function GettingStarted() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-4">Getting Started</h1>
        <p className="text-muted-foreground mb-6">
          Authrix SDK provides complete authentication for React applications with automatic token refresh, 
          session management, and TypeScript support.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Quick Start</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">1. Install the SDK</h3>
            <CodeBlock language="bash">npm install authrix-sdk</CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2">2. Initialize AuthClient</h3>
            <CodeBlock>
{`import { AuthClient, AuthProvider } from 'authrix-sdk';

const authClient = new AuthClient({
  apiKey: 'Your api key',
  baseUrl: ${import.meta.env.VITE_API_BASE_URL}
});`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2">3. Wrap your app</h3>
            <CodeBlock>
{`function App() {
  return (
    <AuthProvider client={authClient}>
      <YourApp />
    </AuthProvider>
  );
}`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2">4. Use authentication</h3>
            <CodeBlock>
{`import { useAuth } from 'authrix-sdk';

function LoginComponent() {
  const { login, user, loading } = useAuth();
  
  const handleLogin = async () => {
    await login({ 
      email: 'user@example.com', 
      password: 'password' 
    });
  };
  
  if (loading) return <div>Loading...</div>;
  
  return user ? (
    <h1>Welcome, {user.username}!</h1>
  ) : (
    <button onClick={handleLogin}>Login</button>
  );
}`}
            </CodeBlock>
          </div>
        </div>
      </div>
    </div>
  )
}
