import CodeBlock from "../../components/CodeBlock";

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
              <p className="text-sm text-muted-foreground mb-3">
                Authenticate a user with their email and password. On success,
                it automatically manages session tokens.
              </p>
              <CodeBlock>
                {`// Usage
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
              <p className="text-sm text-muted-foreground mb-3">
                Create a new user account. If the system requires email
                verification, this will return a verification message.
              </p>
              <CodeBlock>
                {`// Usage
const result = await client.register({
  email: 'user@example.com',
  password: 'password123',
  username: 'johndoe'
});

// Returns: AuthResponse | { message: string }`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">logout()</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Terminate the current session and clear local authentication
                tokens.
              </p>
              <CodeBlock>
                {`const result = await client.logout();
// Returns: { message: string }`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">logoutAll()</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Terminate all active sessions for the user across all devices.
              </p>
              <CodeBlock>
                {`const result = await client.logoutAll();
// Returns: { message: string }`}
              </CodeBlock>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-3">Profile Management</h2>

          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">getCurrentUser()</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Retrieve the profile information for the currently authenticated
                user.
              </p>
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
              <h3 className="font-medium mb-2">updateProfile(data)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Update the current user's profile details such as username or
                email.
              </p>
              <CodeBlock>
                {`const updatedUser = await client.updateProfile({
  username: 'new-username',
  email: 'new-email@example.com'
});

// Returns: User`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">changePassword(data)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Change the authenticated user's password.
              </p>
              <CodeBlock>
                {`const result = await client.changePassword({
  oldPassword: 'currentPassword123',
  newPassword: 'newSecurePassword456'
});

// Returns: { message: string }`}
              </CodeBlock>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-3">Session & Security</h2>

          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">isAuthenticated()</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Check if the user is currently authenticated on the client side.
              </p>
              <CodeBlock>
                {`const authStatus = client.isAuthenticated();
// Returns: boolean`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">getSessions()</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Retrieve a list of all active sessions for the current user.
              </p>
              <CodeBlock>
                {`const sessions = await client.getSessions();

// Returns: Session[]
interface Session {
  id: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  lastUsedAt: string;
}`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">refreshTokens()</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Manually trigger a refresh of the access and refresh tokens.
              </p>
              <CodeBlock>
                {`const tokens = await client.refreshTokens();
// Returns: { accessToken: string, refreshToken: string }`}
              </CodeBlock>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-3">Password Reset</h2>

          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">requestPasswordReset(email)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Send a password reset email to the specified address.
              </p>
              <CodeBlock>
                {`const result = await client.requestPasswordReset('user@example.com');
// Returns: { message: string }`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">
                resetPassword(token, newPassword)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Complete the password reset process using the token received via
                email.
              </p>
              <CodeBlock>
                {`const result = await client.resetPassword('reset-token', 'newPassword123');
// Returns: { message: string }`}
              </CodeBlock>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-3">Admin Operations</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These methods require administrative privileges.
          </p>

          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">
                sendUserEmail(userId, subject, body)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Send a custom email to a specific user.
              </p>
              <CodeBlock>
                {`const result = await client.sendUserEmail(
  'user-id-123',
  'Welcome to Our Platform',
  'Hello! We are glad to have you...'
);`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">
                resetUserPassword(userId, newPassword)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Force reset a specific user's password.
              </p>
              <CodeBlock>
                {`const result = await client.resetUserPassword('user-id-123', 'tempPassword123');`}
              </CodeBlock>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">deleteUser(userId)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete a user account.
              </p>
              <CodeBlock>
                {`const result = await client.deleteUser('user-id-123');`}
              </CodeBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
