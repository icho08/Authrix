import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Shield,
  LayoutDashboard,
  Users,
  Code2,
  Settings,
  User,
  Moon,
  Sun,
  LogOut,
  Menu,
  Bell,
  ChevronRight,
  Sparkles,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { adminApi } from "@/utils/adminApi";
import toast from "react-hot-toast";
import ChatBox from "./chat/ChatBox";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Integration", href: "/dashboard/integration", icon: Code2 },
  { name: "Vulnerability", href: "/dashboard/vulnerability", icon: Shield },
  { name: "App Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Account", href: "/dashboard/account", icon: User },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [apps, setApps] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(
    localStorage.getItem("selectedAppId"),
  );
  const [fetchingApps, setFetchingApps] = useState(true);
  const [showCreateApp, setShowCreateApp] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [creatingApp, setCreatingApp] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      setFetchingApps(true);
      const result = await adminApi.getMyApps();
      const userApps = result.apps || [];
      setApps(userApps);

      if (userApps.length > 0) {
        // If no app selected or selected app no longer exists, default to first app
        if (!selectedAppId || !userApps.find((a) => a.id === selectedAppId)) {
          handleAppChange(userApps[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load apps:", error);
    } finally {
      setFetchingApps(false);
    }
  };

  const handleAppChange = (appId) => {
    if (appId === selectedAppId) return;
    localStorage.setItem("selectedAppId", appId);
    setSelectedAppId(appId);
    // Reload to ensure all components re-fetch for the new appId
    window.location.reload();
  };

  const handleCreateApp = async () => {
    if (!newAppName.trim()) {
      toast.error("Please enter an application name");
      return;
    }

    try {
      setCreatingApp(true);
      const result = await adminApi.createApp(newAppName);
      localStorage.setItem("selectedAppId", result.id);
      setNewAppName("");
      setShowCreateApp(false);
      toast.success("Application created successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Failed to create app:", error);
      toast.error(error.message || "Failed to create application");
    } finally {
      setCreatingApp(false);
    }
  };

  const selectedApp = apps.find((a) => a.id === selectedAppId);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const currentPage =
    navigation.find((item) => item.href === location.pathname)?.name ||
    "Dashboard";

  return (
    <TooltipProvider>
      <div
        className={cn("min-h-screen bg-background relative", isDark && "dark")}
      >
        {/* Subtle Background Mesh */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/3 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-violet-500/3 blur-[120px]" />
        </div>

        {/* Mobile Header */}
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 p-0 border-r border-border/50"
            >
              <MobileSidebar
                user={user}
                isDark={isDark}
                toggleTheme={toggleTheme}
                handleLogout={handleLogout}
                apps={apps}
                selectedApp={selectedApp}
                selectedAppId={selectedAppId}
                handleAppChange={handleAppChange}
                setShowCreateApp={setShowCreateApp}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-primary/20 to-violet-500/20 border border-primary/10 sm:hidden">
              <Sparkles className="w-4 h-4 text-primary sm:hidden" />
            </div>
            <span className="font-bold text-lg tracking-tight sm:hidden">
              Authrix
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <UserDropdown user={user} onLogout={handleLogout} />
          </div>
        </header>

        <div className="flex min-h-screen relative z-10">
          {/* Desktop Sidebar */}
          <aside
            className={cn(
              "hidden md:flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 min-h-screen sticky top-0 h-screen",
              sidebarCollapsed ? "w-[72px]" : "w-[260px]",
            )}
          >
            <div
              className={cn(
                "flex h-16 items-center border-b border-border/50",
                sidebarCollapsed ? "justify-center px-2" : "gap-3 px-5",
              )}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full p-0 flex items-center hover:bg-transparent",
                      sidebarCollapsed ? "justify-center" : "gap-3",
                    )}
                  >
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-violet-500/20 border border-primary/10 transition-transform active:scale-95 group-hover:scale-105">
                      <Sparkles className="h-4.5 w-4.5 text-primary" />
                    </div>
                    {!sidebarCollapsed && (
                      <div className="flex flex-col items-start min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 w-full">
                          <span className="font-bold text-sm truncate">
                            {selectedApp?.name || "Select App"}
                          </span>
                          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        </div>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {selectedApp
                            ? "Switch Application"
                            : "Authrix Dashboard"}
                        </span>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="start">
                  <DropdownMenuLabel>Your Applications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {apps.map((app) => (
                      <DropdownMenuItem
                        key={app.id}
                        className={cn(
                          "flex flex-col items-start gap-1 py-3 px-4",
                          selectedAppId === app.id &&
                            "bg-primary/10 text-primary",
                        )}
                        onClick={() => handleAppChange(app.id)}
                      >
                        <span className="font-semibold text-sm">
                          {app.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground opacity-70 truncate w-full">
                          ID: {app.id}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="py-3 items-center justify-center text-primary font-medium gap-2"
                    onClick={() => setShowCreateApp(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Create New App
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {!sidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                  onClick={() => setSidebarCollapsed(true)}
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
              )}
            </div>

            {/* Expand button when collapsed */}
            {sidebarCollapsed && (
              <div className="flex justify-center pt-3 pb-1">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setSidebarCollapsed(false)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Expand sidebar</TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Navigation */}
            <nav
              className={cn("flex-1 space-y-1 p-3", sidebarCollapsed && "px-2")}
            >
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return sidebarCollapsed ? (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex h-10 w-10 mx-auto items-center justify-center rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-primary/15 text-primary shadow-sm shadow-primary/10"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/15 text-primary shadow-sm shadow-primary/10"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Upgrade Card */}
            <div className="mt-auto">
              {!sidebarCollapsed && (
                <div className="px-3 pb-3">
                  <div className="rounded-xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">
                        Upgrade to Pro
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get unlimited users and advanced analytics.
                    </p>
                    <Button size="sm" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              )}

              <Separator className="opacity-50" />

              {/* User Section */}
              <div className="p-3">
                {sidebarCollapsed ? (
                  <div className="flex flex-col items-center gap-2">
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleTheme}
                          className="h-10 w-10"
                        >
                          {isDark ? (
                            <Sun className="h-5 w-5" />
                          ) : (
                            <Moon className="h-5 w-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Toggle theme</TooltipContent>
                    </Tooltip>
                    <UserDropdown user={user} onLogout={handleLogout} />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="h-9 w-9 border border-border/50 shrink-0">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {user?.username?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {user?.username || user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-8 w-8"
                      >
                        {isDark ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </Button>
                      <UserDropdown user={user} onLogout={handleLogout} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="hidden md:flex h-16 items-center justify-between border-b border-border/50 px-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-lg font-semibold">{currentPage}</h1>
                  <p className="text-xs text-muted-foreground">
                    Manage your{" "}
                    {currentPage.toLowerCase() === "overview"
                      ? "application"
                      : currentPage.toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  disabled
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 opacity-50" />
                <UserDropdown user={user} onLogout={handleLogout} />
              </div>
            </div>
            <div className="p-6">{children}</div>
          </main>
        </div>
        <ChatBox />
      </div>
      {/* Global Create App Dialog */}
      <Dialog open={showCreateApp} onOpenChange={setShowCreateApp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Application</DialogTitle>
            <DialogDescription>
              Enter a name for your new application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-app-name">Application Name</Label>
              <Input
                id="new-app-name"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                placeholder="My Awesome App"
                disabled={creatingApp}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateApp(false)}
              disabled={creatingApp}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateApp} disabled={creatingApp}>
              {creatingApp ? "Creating..." : "Create Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

function MobileSidebar({
  user,
  isDark,
  toggleTheme,
  handleLogout,
  apps,
  selectedApp,
  selectedAppId,
  handleAppChange,
  setShowCreateApp,
}) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/50 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-violet-500/20 border border-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-lg">Authrix</span>
      </div>

      <div className="px-3 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-12 bg-card/50 border-border/50 px-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold text-sm truncate">
                  {selectedApp?.name || "Select Application"}
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[calc(100vw-48px)] mx-3"
            align="start"
          >
            <DropdownMenuLabel>Your Applications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {apps.map((app) => (
                <DropdownMenuItem
                  key={app.id}
                  className={cn(
                    "flex flex-col items-start gap-1 py-3 px-4",
                    selectedAppId === app.id && "bg-primary/10 text-primary",
                  )}
                  onClick={() => handleAppChange(app.id)}
                >
                  <span className="font-semibold text-sm">{app.name}</span>
                  <span className="text-[10px] text-muted-foreground opacity-70 truncate w-full">
                    ID: {app.id}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="py-3 items-center justify-center text-primary font-medium gap-2"
              onClick={() => setShowCreateApp(true)}
            >
              <Plus className="h-4 w-4" />
              Create New App
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <Separator className="opacity-50" />
      <div className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.username?.[0] || user?.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {user?.username || user?.email}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function UserDropdown({ user, onLogout }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border border-border/50">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user?.username?.[0] || user?.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.username || user?.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard/account">
            <User className="mr-2 h-4 w-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            App Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
