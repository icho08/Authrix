import CodeBlock from '../../components/CodeBlock'

export default function TypeScript() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-4">TypeScript Support</h1>
        <p className="text-muted-foreground mb-6">
          Authrix SDK is built with TypeScript and provides comprehensive type definitions.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Type Definitions</h2>
        <CodeBlock>
{`// Import types
import type { 
  AuthConfig, 
  RegisterData, 
  LoginData, 
  User, 
  AuthResponse, 
  Session 
} from 'authrix-sdk';

// Configuration
interface AuthConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

// User data
interface User {
  id: string;
  email: string;
  username?: string;
  isVerified: boolean;
}

// Authentication data
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
}

// Response types
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface Session {
  id: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  deviceType?: string;
  location?: string;
  ipAddress?: string;
  createdAt: string;
  lastUsedAt: string;
}`}
        </CodeBlock>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Typed Components</h2>
        <CodeBlock>
{`import { useAuth } from 'authrix-sdk';
import type { User } from 'authrix-sdk';

interface UserProfileProps {
  user: User;
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      <h1>{user.username || user.email}</h1>
      <p>Verified: {user.isVerified ? 'Yes' : 'No'}</p>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return <UserProfile user={user} />;
}`}
        </CodeBlock>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Error Handling</h2>
        <CodeBlock>
{`import { useAuth } from 'authrix-sdk';
import type { LoginData } from 'authrix-sdk';

function LoginForm() {
  const { login } = useAuth();
  
  const handleLogin = async (data: LoginData) => {
    try {
      await login(data);
    } catch (error) {
      // Error is properly typed
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
      }
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleLogin({
        email: formData.get('email') as string,
        password: formData.get('password') as string
      });
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}`}
        </CodeBlock>
      </div>
    </div>
  )
}
