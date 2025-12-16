import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  UsersIcon,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Download,
  Mail,
  Trash2,
  Shield,
  Loader2,
  User,
  Calendar,
  Key,
  Monitor,
  Smartphone,
  MapPin,
} from "lucide-react"
import { adminApi } from "@/utils/adminApi"
import toast from "react-hot-toast"

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [app, setApp] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetailOpen, setUserDetailOpen] = useState(false)
  const [userSessions, setUserSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [showAllSessions, setShowAllSessions] = useState(false)

  useEffect(() => {
    fetchAppAndUsers()
  }, [])

  const fetchAppAndUsers = async () => {
    try {
      setLoading(true)
      const appData = await adminApi.getMyApp()
      console.log('App data received:', appData)
      setApp(appData.app) // Fix: access the nested app object
      
      if (appData?.app?.id) { // Fix: check nested app.id
        console.log('Fetching users for app ID:', appData.app.id)
        const usersData = await adminApi.getAppUsers(appData.app.id)
        console.log('Users data received:', usersData)
        setUsers(usersData || [])
      } else {
        console.log('No app ID found in app data')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.isVerified === (statusFilter === "verified")
    return matchesSearch && matchesStatus
  })

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: UsersIcon,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Verified",
      value: users.filter(u => u.isVerified).length.toString(),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Unverified",
      value: users.filter(u => !u.isVerified).length.toString(),
      icon: XCircle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Recent",
      value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length.toString(),
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ]

  const getStatusBadge = (isVerified) => {
    if (isVerified) {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 gap-1">
          <XCircle className="h-3 w-3" />
          Unverified
        </Badge>
      )
    }
  }

  const handleUserClick = async (user) => {
    setSelectedUser(user)
    setUserDetailOpen(true)
    setUserSessions([])
    setShowAllSessions(false) // Reset view more state
    
    // Fetch sessions for the specific user
    try {
      setLoadingSessions(true)
      const sessions = await adminApi.getUserSessions(user.id)
      setUserSessions(sessions || [])
    } catch (error) {
      console.error('Failed to load user sessions:', error)
    } finally {
      setLoadingSessions(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={cn("rounded-lg p-2", stat.bg)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage and monitor your application users</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" disabled>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table or Empty State */}
          {filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.email?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div 
                            className="font-medium cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleUserClick(user)}
                          >
                            {user.username || 'No username'}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.isVerified)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUserClick(user)}>
                            <User className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <UsersIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {users.length === 0 ? "No users yet" : "No users match your search"}
              </h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                {users.length === 0 
                  ? "Users will appear here once they register through your application."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {users.length === 0 && (
                <Card className="bg-primary/5 border-primary/20 max-w-sm">
                  <CardContent className="pt-4">
                    <p className="text-sm text-primary">
                      💡 Tip: Check the Integration page to set up user registration in your app
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Details
            </DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedUser.email?.charAt(0).toUpperCase() || selectedUser.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedUser.username || 'No username'}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedUser.isVerified)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* User Details Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      User ID
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                      {selectedUser.id}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Account Created
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Last Updated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : 'Never'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {selectedUser.isVerified ? 'Email verified' : 'Email not verified'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* User Sessions */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Active Sessions
                </h4>
                
                {loadingSessions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : userSessions.length > 0 ? (
                  <div className="space-y-3">
                    {(showAllSessions ? userSessions : userSessions.slice(0, 5)).map((session) => (
                      <Card key={session.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                              {session.deviceType === 'mobile' ? (
                                <Smartphone className="h-4 w-4" />
                              ) : (
                                <Monitor className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {session.deviceName || `${session.browser} on ${session.os}`}
                                </p>
                                {session.isActive && (
                                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1 mt-1">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {session.ipAddress} {session.location && `• ${session.location}`}
                                </div>
                                <div>
                                  Last used: {new Date(session.lastUsedAt).toLocaleString()}
                                </div>
                                <div>
                                  Created: {new Date(session.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {userSessions.length > 5 && (
                      <div className="text-center pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowAllSessions(!showAllSessions)}
                        >
                          {showAllSessions ? 'Show Less' : `View More (${userSessions.length - 5} more)`}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No active sessions found</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" disabled>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" disabled>
                  Reset Password
                </Button>
                <Button variant="destructive" disabled>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
