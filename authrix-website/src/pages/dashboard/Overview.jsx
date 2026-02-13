import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
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
  EyeOff,
  Sparkles,
  Zap,
  BarChart3,
} from "lucide-react";
import { adminApi } from "@/utils/adminApi";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function Overview() {
  const { user, baseUrl } = useAuth();
  const [app, setApp] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateApp, setShowCreateApp] = useState(false);
  const [appName, setAppName] = useState("");
  const [copied, setCopied] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserApp();
    }
  }, [user]);

  const loadUserApp = async () => {
    try {
      setLoading(true);
      const result = await adminApi.getMyApp();
      setApp(result.app);

      if (result.app?.id) {
        const usersData = await adminApi.getAppUsers(result.app.id);
        setUsers(usersData || []);
      }
    } catch (error) {
      console.error("Failed to load app:", error);
      setError("Failed to load application data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApp = async () => {
    if (!appName.trim()) {
      toast.error("Please enter an application name");
      return;
    }

    try {
      const newApp = await adminApi.createApp(appName);
      setApp(newApp);
      setShowCreateApp(false);
      setAppName("");
      toast.success("Application created successfully!");
    } catch (error) {
      console.error("Failed to create app:", error);
      toast.error(error.message || "Failed to create application");
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error(err.message || "Failed to copy");
    }
  };

  const stats = [
    {
      title: "Active Sessions",
      value: app?.activeSessions?.toString() || "0",
      change: "Live now",
      icon: Activity,
      color: "text-purple-500 dark:text-purple-400",
      bg: "bg-purple-500/10",
      ringColor: "ring-purple-500/20",
    },
    {
      title: "Total Users",
      value: users?.length?.toString() || "0",
      change:
        (
          users?.filter(
            (u) =>
              u?.createdAt &&
              new Date(u.createdAt) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          )?.length || 0
        ).toString() + " this month",
      icon: Users,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-500/10",
      ringColor: "ring-blue-500/20",
    },
    {
      title: "Verified Users",
      value: (users?.filter((u) => u?.isVerified)?.length || 0).toString(),
      change:
        Math.round(
          ((users?.filter((u) => u?.isVerified)?.length || 0) /
            Math.max(users?.length || 0, 1)) *
            100,
        ) + "% verified",
      icon: CheckCircle2,
      color: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      ringColor: "ring-emerald-500/20",
    },
    {
      title: "Recent Signups",
      value: (
        users?.filter(
          (u) =>
            u?.createdAt &&
            new Date(u.createdAt) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        )?.length || 0
      ).toString(),
      change: "Last 7 days",
      icon: UserPlus,
      color: "text-orange-500 dark:text-orange-400",
      bg: "bg-orange-500/10",
      ringColor: "ring-orange-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">
            Loading your dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive font-medium">{error}</p>
          <Button onClick={loadUserApp} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/60 shadow-xl shadow-primary/20">
            <Plus className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">
          Create Your First Application
        </h2>
        <p className="text-muted-foreground max-w-md mb-8 text-lg">
          Get started by creating an application to receive your API keys and
          begin integrating authentication.
        </p>
        <Dialog open={showCreateApp} onOpenChange={setShowCreateApp}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" />
              Create Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Application</DialogTitle>
              <DialogDescription>
                Enter a name for your new application. You can change this
                later.
              </DialogDescription>
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
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back{user?.username ? `, ${user.username}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of{" "}
          <span className="font-medium text-foreground">{app.name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md hover:border-border transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={cn(
                  "rounded-xl p-2.5 ring-1",
                  stat.bg,
                  stat.ringColor,
                )}
              >
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Credentials Panel */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl">{app.name}</CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Active
                </Badge>
              </div>
              <CardDescription className="font-mono text-xs">
                ID: {app.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator className="opacity-50" />
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* API Key */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                  <Key className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <Label className="text-sm font-medium">API Key</Label>
                  <p className="text-xs text-muted-foreground">
                    Use in client-side code
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    readOnly
                    value={showApiKey ? app.apiKey : "•".repeat(32)}
                    className="pr-10 font-mono text-sm bg-muted/30 border-border/50"
                  />
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showApiKey ? "Hide" : "Show"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        onClick={() => copyToClipboard(app.apiKey, "api")}
                      >
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 ring-1 ring-rose-500/20">
                  <Shield className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Secret Key</Label>
                  <p className="text-xs text-muted-foreground">
                    Keep this private — server-side only
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    readOnly
                    type={showSecret ? "text" : "password"}
                    value={app.secretKey}
                    className="pr-10 font-mono text-sm bg-muted/30 border-border/50"
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showSecret ? "Hide" : "Show"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        onClick={() => copyToClipboard(app.secretKey, "secret")}
                      >
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
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge
                variant={app.requireEmailVerification ? "default" : "secondary"}
                className={
                  app.requireEmailVerification
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : ""
                }
              >
                {app.requireEmailVerification ? "Required" : "Optional"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              Created
            </CardTitle>
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
              {Math.floor(
                (Date.now() - new Date(app.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24),
              )}{" "}
              days ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Section */}
      <div className="space-y-4 sm:hidden hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Coming Soon
            </h2>
          </div>
          <Separator className="flex-1 opacity-50" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/30 bg-card/30 backdrop-blur-sm opacity-70 hover:opacity-90 transition-opacity duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary/60" />
                API Usage Analytics
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">This month</span>
                <span className="font-medium text-muted-foreground">0 / ∞</span>
              </div>
              <Progress value={0} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                Track your API requests, response times, and error rates.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/30 bg-card/30 backdrop-blur-sm opacity-70 hover:opacity-90 transition-opacity duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary/60" />
                Advanced Features
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  Session timeout configuration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  Rate limiting controls
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  Webhook events
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
