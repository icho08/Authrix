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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { adminApi } from "@/utils/adminApi";
import toast from "react-hot-toast";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [userSessions, setUserSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [showAllSessions, setShowAllSessions] = useState(false);

  useEffect(() => {
    fetchAppAndUsers();
  }, []);

  const fetchAppAndUsers = async () => {
    try {
      setLoading(true);
      const appData = await adminApi.getMyApp();
      setApp(appData.app);

      if (appData?.app?.id) {
        const usersData = await adminApi.getAppUsers(appData.app.id);
        setUsers(usersData || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      user.isVerified === (statusFilter === "verified");
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: UsersIcon,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      title: "Verified",
      value: users.filter((u) => u.isVerified).length.toString(),
      icon: CheckCircle2,
      color: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    {
      title: "Unverified",
      value: users.filter((u) => !u.isVerified).length.toString(),
      icon: XCircle,
      color: "text-rose-500 dark:text-rose-400",
      bg: "bg-rose-500/10",
      ring: "ring-rose-500/20",
    },
    {
      title: "This Week",
      value: users
        .filter(
          (u) =>
            new Date(u.createdAt) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        )
        .length.toString(),
      icon: Clock,
      color: "text-amber-500 dark:text-amber-400",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
    },
  ];

  const getStatusBadge = (isVerified) => {
    if (isVerified) {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 hover:bg-emerald-500/15">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 gap-1 hover:bg-rose-500/15">
          <XCircle className="h-3 w-3" />
          Unverified
        </Badge>
      );
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
    setUserSessions([]);
    setShowAllSessions(false);

    try {
      setLoadingSessions(true);
      const sessions = await adminApi.getUserSessions(user.id);
      setUserSessions(sessions || []);
    } catch (error) {
      console.error("Failed to load user sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">
            Loading users...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor your application users
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md hover:border-border transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={cn("rounded-xl p-2.5 ring-1", stat.bg, stat.ring)}
              >
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription className="mt-1">
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-border/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <Separator className="opacity-50" />
        <CardContent className="pt-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9 border-border/50 bg-muted/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-border/50">
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
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Joined</TableHead>
                    <TableHead className="font-semibold">
                      Last Updated
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                      onClick={() => handleUserClick(user)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border/50">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                              {user.email?.charAt(0).toUpperCase() ||
                                user.username?.charAt(0).toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">
                              {user.username || "No username"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.isVerified)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.updatedAt
                          ? new Date(user.updatedAt).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserClick(user);
                              }}
                            >
                              <User className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled
                              className="text-destructive"
                            >
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                <UsersIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {users.length === 0
                  ? "No users yet"
                  : "No users match your search"}
              </h3>
              <p className="text-muted-foreground max-w-sm mb-6 text-sm">
                {users.length === 0
                  ? "Users will appear here once they register through your application."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {users.length === 0 && (
                <Card className="bg-primary/5 border-primary/20 max-w-sm">
                  <CardContent className="pt-4">
                    <p className="text-sm text-primary">
                      💡 Tip: Check the Integration page to set up user
                      registration in your app
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
              <User className="h-5 w-5 text-primary" />
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
                <Avatar className="h-16 w-16 border border-border/50">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                    {selectedUser.email?.charAt(0).toUpperCase() ||
                      selectedUser.username?.charAt(0).toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedUser.username || "No username"}
                  </h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedUser.isVerified)}
                  </div>
                </div>
              </div>

              <Separator className="opacity-50" />

              {/* User Details Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-border/50 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Key className="h-4 w-4 text-primary" />
                      User ID
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded-lg break-all border border-border/30">
                      {selectedUser.id}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Account Created
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Last Updated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {selectedUser.updatedAt
                        ? new Date(selectedUser.updatedAt).toLocaleString()
                        : "Never"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {selectedUser.isVerified
                        ? "Email verified"
                        : "Email not verified"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator className="opacity-50" />

              {/* User Sessions */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  Active Sessions
                  {userSessions.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {userSessions.length}
                    </Badge>
                  )}
                </h4>

                {loadingSessions ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Loading sessions...
                      </span>
                    </div>
                  </div>
                ) : userSessions.length > 0 ? (
                  <div className="space-y-3">
                    {(showAllSessions
                      ? userSessions
                      : userSessions.slice(0, 5)
                    ).map((session) => (
                      <Card
                        key={session.id}
                        className="p-4 border-border/50 bg-card/50 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-muted/50 ring-1 ring-border/50">
                              {session.deviceType === "mobile" ? (
                                <Smartphone className="h-4 w-4" />
                              ) : (
                                <Monitor className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">
                                  {session.deviceName ||
                                    `${session.browser} on ${session.os}`}
                                </p>
                                {session.isActive && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  >
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground space-y-0.5 mt-1.5">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {session.ipAddress}{" "}
                                  {session.location && `• ${session.location}`}
                                </div>
                                <div>
                                  Last used:{" "}
                                  {new Date(
                                    session.lastUsedAt,
                                  ).toLocaleString()}
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
                          className="border-border/50"
                          onClick={() => setShowAllSessions(!showAllSessions)}
                        >
                          {showAllSessions
                            ? "Show Less"
                            : `View More (${userSessions.length - 5} more)`}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <Monitor className="h-6 w-6 opacity-50" />
                    </div>
                    <p className="text-sm">No active sessions found</p>
                  </div>
                )}
              </div>

              <Separator className="opacity-50" />

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" disabled className="border-border/50">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" disabled className="border-border/50">
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
  );
}
