import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  Plus,
  Key,
  Shield,
  Copy,
  Check,
  Users,
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  ArrowUpRight,
  Eye, 
  EyeOff
  
} from "lucide-react"
import { adminApi } from "@/utils/adminApi"
import { useAuth } from "@/contexts/AuthContext"
import toast from "react-hot-toast"

export default function Overview() {
  const { user, baseUrl } = useAuth()
  const [app, setApp] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateApp, setShowCreateApp] = useState(false)
  const [appName, setAppName] = useState("")
  const [copied, setCopied] = useState(null)
  const [showSecret, setShowSecret] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadUserApp()
    }
  }, [user])

  const loadUserApp = async () => {
    try {
      setLoading(true)
      const result = await adminApi.getMyApp()
      setApp(result.app)
      
      // Also fetch users for statistics
      if (result.app?.id) {
        const usersData = await adminApi.getAppUsers(result.app.id)
        setUsers(usersData || [])
      }
    } catch (error) {
      console.error('Failed to load app:', error)
      setError('Failed to load application data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateApp = async () => {
    if (!appName.trim()) {
      toast.error('Please enter an application name')
      return
    }

    try {
      const newApp = await adminApi.createApp(appName)
      setApp(newApp)
      setShowCreateApp(false)
      setAppName('')
      toast.success('Application created successfully!')
    } catch (error) {
      console.error('Failed to create app:', error)
      toast.error(error.message || 'Failed to create application')
    }
  }

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  // User statistics - now with real data
  const stats = [
    {
      title: "Total Users",
      value: users?.length?.toString() || "0",
      change: (users?.filter(u => u?.createdAt && new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))?.length || 0).toString() + " this month",
      trend: "up",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      disabled: false,
    },
    {
      title: "Verified Users",
      value: (users?.filter(u => u?.isVerified)?.length || 0).toString(),
      change: Math.round(((users?.filter(u => u?.isVerified)?.length || 0) / Math.max(users?.length || 0, 1)) * 100) + "% of total",
      trend: "up",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      disabled: false,
    },
    {
      title: "Recent Signups",
      value: (users?.filter(u => u?.createdAt && new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))?.length || 0).toString(),
      change: "Last 7 days",
      trend: "up",
      icon: UserPlus,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      disabled: false,
    },
    {
      title: "Active Sessions",
      value: "0",
      change: "N/A",
      trend: "neutral",
      icon: Activity,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      disabled: true,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadUserApp} variant="outline">Try Again</Button>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
            <Plus className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Create Your First Application</h2>
        <p className="text-muted-foreground max-w-md mb-8 text-lg">
          Get started by creating an application to receive your API keys and begin integrating authentication.
        </p>
        <Dialog open={showCreateApp} onOpenChange={setShowCreateApp}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Application</DialogTitle>
              <DialogDescription>Enter a name for your new application. You can change this later.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Application Name</Label>
                <Input
                  id="name"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="My Awesome App"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateApp(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateApp}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid - Disabled features */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className={cn("relative overflow-hidden", stat.disabled && "opacity-60")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={cn("rounded-lg p-2", stat.bg)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.disabled && (
                  <Badge variant="secondary" className="text-xs">
                    Coming Soon
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.disabled ? "Feature not available yet" : "from last month"}
              </p>
            </CardContent>
            <div className={cn("absolute bottom-0 left-0 right-0 h-1", stat.bg)} />
          </Card>
        ))}
      </div>

      {/* App Overview Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl">{app.name}</CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </Badge>
              </div>
              <CardDescription className="font-mono text-xs">{app.id}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ArrowUpRight className="h-4 w-4 mr-1" />
                View Docs
              </Button>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* API Key */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Key className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <Label className="text-sm font-medium">API Key</Label>
                  <p className="text-xs text-muted-foreground">Use in client-side code</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input readOnly value={app.apiKey} className="pr-10 font-mono text-sm bg-muted/50" />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(app.apiKey, "api")}>
                        {copied === "api" ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy API Key</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Secret Key */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                  <Shield className="h-4 w-4 text-rose-500" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Secret Key</Label>
                  <p className="text-xs text-muted-foreground">Keep this private</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    readOnly
                    type={showSecret ? "text" : "password"}
                    value={app.secretKey}
                    className="pr-10 font-mono text-sm bg-muted/50"
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setShowSecret(!showSecret)}>
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{showSecret ? "Hide" : "Show"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(app.secretKey, "secret")}>
                        {copied === "secret" ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Secret Key</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-transparent border-primary/20 opacity-60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              API Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">This month</span>
              <span className="font-medium">0 / ∞</span>
            </div>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-muted-foreground">Analytics coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Email Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge variant={app.requireEmailVerification ? "default" : "secondary"}>
                {app.requireEmailVerification ? "Required" : "Optional"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {new Date(app.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.floor((Date.now() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
