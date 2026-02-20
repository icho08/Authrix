import CodeBlock from "../../components/CodeBlock";

export default function AuthClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-4">AuthClient</h1>
        <p className="text-muted-foreground mb-6">
          The AuthClient class handles all authentication operations and HTTP
          communication.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Configuration</h2>
        <CodeBlock>
          {`interface AuthConfig {
  apiKey: string;        // Your application API key (required)
  baseUrl?: string;      // API base URL (optional)
  timeout?: number;      // Request timeout in ms (optional)
  retries?: number;      // Number of retries (optional)
}

const client = new AuthClient({
  apiKey: 'your-api-key',
  baseUrl: ${import.meta.env.VITE_API_BASE_URL},
  timeout: 10000,  // 10 seconds
  retries: 3       // retry failed requests 3 times
});`}
        </CodeBlock>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Methods</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Authentication</h3>
            <div className="space-y-2">
              <CodeBlock>await client.register(data);</CodeBlock>
              <CodeBlock>await client.login(data);</CodeBlock>
              <CodeBlock>await client.logout();</CodeBlock>
              <CodeBlock>await client.logoutAll();</CodeBlock>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Session & Management</h3>
            <div className="space-y-2">
              <CodeBlock>client.isAuthenticated();</CodeBlock>
              <CodeBlock>await client.getCurrentUser();</CodeBlock>
              <CodeBlock>await client.getSessions();</CodeBlock>
              <CodeBlock>await client.refreshTokens();</CodeBlock>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">User Profile</h3>
            <div className="space-y-2">
              <CodeBlock>await client.updateProfile(data);</CodeBlock>
              <CodeBlock>await client.changePassword(data);</CodeBlock>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Password Recovery</h3>
            <div className="space-y-2">
              <CodeBlock>await client.requestPasswordReset(email);</CodeBlock>
              <CodeBlock>
                await client.resetPassword(token, newPassword);
              </CodeBlock>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Admin Tools</h3>
            <div className="space-y-2">
              <CodeBlock>
                await client.sendUserEmail(userId, subject, body);
              </CodeBlock>
              <CodeBlock>
                await client.resetUserPassword(userId, newPassword);
              </CodeBlock>
              <CodeBlock>await client.deleteUser(userId);</CodeBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
