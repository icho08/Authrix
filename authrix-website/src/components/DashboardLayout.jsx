import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Integration", href: "/dashboard/integration", icon: Code2 },
  { name: "App Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Account", href: "/dashboard/account", icon: User },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/[0.03] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-violet-500/[0.03] blur-[120px]" />
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
            {/* Logo */}
            <div
              className={cn(
                "flex h-16 items-center border-b border-border/50",
                sidebarCollapsed ? "justify-center px-2" : "gap-3 px-5",
              )}
            >
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-violet-500/20 border border-primary/10">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight">
                    Authrix
                  </span>
                  <span className="text-[10px] text-muted-foreground -mt-0.5">
                    Dashboard
                  </span>
                </div>
              )}
              {!sidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-7 w-7 text-muted-foreground hover:text-foreground"
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
      </div>
    </TooltipProvider>
  );
}

function MobileSidebar({ user, isDark, toggleTheme, handleLogout }) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/50 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-violet-500/20 border border-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-lg">Authrix</span>
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
