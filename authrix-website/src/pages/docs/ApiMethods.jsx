import CodeBlock from '../../components/CodeBlock'

export default function ApiMethods() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-4">API Methods</h1>
        <p className="text-muted-foreground mb-6">
          Complete reference for all available authentication methods.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-medium mb-3">Authentication</h2>
          
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">login(credentials)</h3>
              <p className="text-sm text-muted-foreground mb-3">Authenticate user with email and password</p>
              <CodeBlock>
{`// Parameters
interface LoginData {
  email: string;
  password: string;
}

// Usage
const result = await client.login({
  email: 'user@example.com',
  password: 'password123'
});

// Returns: AuthResponse
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">register(userData)</h3>
              <p className="text-sm text-muted-foreground mb-3">Create new user account</p>
              <CodeBlock>
{`// Parameters
interface RegisterData {
  email: string;
  password: string;
  username: string;
}

// Usage
const result = await client.register({
  email: 'user@example.com',
  password: 'password123',
  username: 'johndoe'
});`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">logout()</h3>
              <p className="text-sm text-muted-foreground mb-3">Logout from current device</p>
              <CodeBlock>
{`const result = await client.logout();
// Returns: { message: string }`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">logoutAll()</h3>
              <p className="text-sm text-muted-foreground mb-3">Logout from all devices</p>
              <CodeBlock>
{`const result = await client.logoutAll();
// Returns: { message: string }`}
              </CodeBlock>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-3">User Management</h2>
          
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">getCurrentUser()</h3>
              <p className="text-sm text-muted-foreground mb-3">Get current authenticated user</p>
              <CodeBlock>
{`const user = await client.getCurrentUser();

// Returns: User
interface User {
  id: string;
  email: string;
  username?: string;
  isVerified: boolean;
}`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">getSessions()</h3>
              <p className="text-sm text-muted-foreground mb-3">Get all user sessions</p>
              <CodeBlock>
{`const sessions = await client.getSessions();

// Returns: Session[]
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
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-3">Password Reset</h2>
          
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">requestPasswordReset(email)</h3>
              <p className="text-sm text-muted-foreground mb-3">Request password reset email</p>
              <CodeBlock>
{`const result = await client.requestPasswordReset('user@example.com');
// Returns: { message: string }`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">resetPassword(token, newPassword)</h3>
              <p className="text-sm text-muted-foreground mb-3">Reset password with token from email</p>
              <CodeBlock>
{`const result = await client.resetPassword('reset-token', 'newPassword123');
// Returns: { message: string }`}
              </CodeBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
