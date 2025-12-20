import CodeBlock from '../../components/CodeBlock'

export default function AuthClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-4">AuthClient</h1>
        <p className="text-muted-foreground mb-6">
          The AuthClient class handles all authentication operations and HTTP communication.
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
            <h3 className="font-medium mb-2">register(data)</h3>
            <CodeBlock>
{`await client.register({
  email: 'user@example.com',
  password: 'securePassword123',
  username: 'johndoe'
});`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2">login(data)</h3>
            <CodeBlock>
{`await client.login({
  email: 'user@example.com',
  password: 'securePassword123'
});`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2">logout()</h3>
            <CodeBlock>await client.logout(); // Logout from current device</CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2">logoutAll()</h3>
            <CodeBlock>await client.logoutAll(); // Logout from all devices</CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2">getCurrentUser()</h3>
            <CodeBlock>const user = await client.getCurrentUser();</CodeBlock>
          </div>

          <div>
            <h3 className="font-medium mb-2">getSessions()</h3>
            <CodeBlock>const sessions = await client.getSessions();</CodeBlock>
          </div>
        </div>
      </div>
    </div>
  )
}
