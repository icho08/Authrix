"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Code2, Copy, Check, ExternalLink, Terminal, FileCode, Braces, BookOpen, Rocket } from "lucide-react"

export default function Integration() {
  const [copied, setCopied] = useState(null)

  const app = {
    apiKey: "ax_live_1234567890abcdef",
  }
  const baseUrl = ""

  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const CodeBlock = ({ code, id, language = "javascript" }) => (
    <div className="relative group">
      <div className="absolute right-3 top-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => copyToClipboard(code, id)}
        >
          {copied === id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="bg-zinc-950 dark:bg-zinc-900 rounded-xl p-4 overflow-x-auto border border-zinc-800">
        <code className="text-sm text-emerald-400 font-mono">{code}</code>
      </pre>
    </div>
  )

  const installCode = `npm install authrix-sdk`

  const initCode = `import { AuthClient } from 'authrix-sdk';

const authClient = new AuthClient({
  apiKey: '${app.apiKey}',
  baseUrl: '${baseUrl}'
});`

  const reactCode = `import { useAuth } from 'authrix-sdk';

function App() {
  const { login, user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <p>Welcome {user.username}!</p>
      ) : (
        <button onClick={() => login({ 
          email: 'user@example.com', 
          password: 'password' 
        })}>
          Login
        </button>
      )}
    </div>
  );
}`

  const apiMethods = [
    { method: "login(credentials)", description: "Sign in user with email & password" },
    { method: "register(userData)", description: "Create new user account" },
    { method: "logout()", description: "Sign out current user" },
    { method: "getCurrentUser()", description: "Get authenticated user data" },
    { method: "requestPasswordReset(email)", description: "Send password reset code" },
    { method: "resetPassword(code, newPassword)", description: "Reset user password" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Integration Guide</h2>
          <p className="text-muted-foreground">Get started with Authrix SDK in your application</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <BookOpen className="h-4 w-4" />
          View Full Docs
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      {/* Quick Start Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Get up and running in minutes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  1
                </div>
                <div className="flex-1 w-px bg-border mt-2" />
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Install the SDK</h3>
                </div>
                <CodeBlock code={installCode} id="install" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  2
                </div>
                <div className="flex-1 w-px bg-border mt-2" />
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 mb-3">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Initialize the client</h3>
                </div>
                <CodeBlock code={initCode} id="init" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  3
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Braces className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Use in your React app</h3>
                </div>
                <CodeBlock code={reactCode} id="react" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
              <Code2 className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>Available SDK methods and their usage</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Tabs defaultValue="auth" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="password">Password Reset</TabsTrigger>
            </TabsList>
            <TabsContent value="auth" className="mt-6">
              <div className="rounded-lg border divide-y">
                {apiMethods.slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                      {item.method}
                    </code>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="password" className="mt-6">
              <div className="rounded-lg border divide-y">
                {apiMethods.slice(4).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                      {item.method}
                    </code>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* SDKs */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: "JavaScript", version: "v2.1.0", status: "stable" },
          { name: "Python", version: "v1.8.0", status: "stable" },
          { name: "Go", version: "v0.9.0", status: "beta" },
        ].map((sdk) => (
          <Card key={sdk.name} className="group hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{sdk.name} SDK</CardTitle>
                <Badge variant={sdk.status === "stable" ? "secondary" : "outline"}>{sdk.status}</Badge>
              </div>
              <CardDescription>{sdk.version}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start gap-2 group-hover:text-primary">
                <ExternalLink className="h-4 w-4" />
                View documentation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
