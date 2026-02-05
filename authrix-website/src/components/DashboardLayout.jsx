import { useState } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
} from "lucide-react"
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Integration", href: "/dashboard/integration", icon: Code2 },
  { name: "App Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Account", href: "/dashboard/account", icon: User },
]

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const currentPage = navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'

  return (
    <TooltipProvider>
      <div className={cn("min-h-screen bg-background", isDark && "dark")}>
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <MobileSidebar
                user={user}
                isDark={isDark}
                toggleTheme={toggleTheme}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Authrix</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <UserDropdown user={user} onLogout={handleLogout} />
          </div>
        </header>

        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside
            className={cn(
              "hidden md:flex flex-col border-r bg-card transition-all duration-300 min-h-screen",
              sidebarCollapsed ? "w-16" : "w-64",
            )}
          >
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b px-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight">Authrix</span>
                  <span className="text-[10px] text-muted-foreground -mt-1">Authentication Platform</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={cn("ml-auto h-7 w-7", sidebarCollapsed && "hidden")}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return sidebarCollapsed ? (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
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
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Upgrade Card */}
            <div className="mt-auto">
              {!sidebarCollapsed && (
                <div className="p-3">
                  <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Upgrade to Pro</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Get unlimited users and advanced analytics.</p>
                    <Button size="sm" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* User Section */}
              <div className="p-3">
                {sidebarCollapsed ? (
                  <div className="flex flex-col items-center gap-2">
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-10 w-10">
                          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Toggle theme</TooltipContent>
                    </Tooltip>
                    <UserDropdown user={user} onLogout={handleLogout} />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="h-9 w-9 border shrink-0">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {user?.username?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{user?.username || user?.email}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
            <div className="hidden md:flex h-16 items-center justify-between border-b px-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">{currentPage}</h1>
                  <p className="text-xs text-muted-foreground">
                    Manage your {currentPage.toLowerCase() === "overview" ? "application" : currentPage.toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative" disabled>
                  <Bell className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <UserDropdown user={user} onLogout={handleLogout} />
              </div>
            </div>
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}

function MobileSidebar({ user, isDark, toggleTheme }) {
  const location = useLocation()
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg">Authrix</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <Separator />
      <div className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{user?.username?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.username || user?.email}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

function UserDropdown({ user, onLogout }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border">
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
            <p className="text-sm font-medium leading-none">{user?.username || user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
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
        <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
