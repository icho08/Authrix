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
      const result = await adminApi.getMyApps();
      const userApps = result.apps || [];
      const selectedId = localStorage.getItem("selectedAppId");
      const currentApp =
        userApps.find((a) => a.id === selectedId) || userApps[0];

      setApp(currentApp);

      if (currentApp?.id) {
        const usersData = await adminApi.getAppUsers(currentApp.id);
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

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  const handleSendEmail = async () => {
    if (!emailSubject || !emailBody) {
      toast.error("Please fill in both subject and message");
      return;
    }

    try {
      setSendingEmail(true);
      await adminApi.sendCustomEmail(
        app.id,
        selectedUser.id,
        emailSubject,
        emailBody,
      );
      toast.success("Email sent successfully");
      setEmailModalOpen(false);
      setEmailSubject("");
      setEmailBody("");
    } catch (error) {
      toast.error(error.message || "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    try {
      setResettingPassword(true);
      await adminApi.resetUserPassword(app.id, selectedUser.id, newPassword);
      toast.success("Password reset successfully");
      setResetPasswordOpen(false);
      setNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  const [togglingVerification, setTogglingVerification] = useState(false);

  const handleToggleVerification = async () => {
    try {
      setTogglingVerification(true);
      const newStatus = !selectedUser.isVerified;
      await adminApi.toggleUserVerification(app.id, selectedUser.id, newStatus);
      toast.success(
        `User ${newStatus ? "verified" : "unverified"} successfully`,
      );

      const updatedUser = { ...selectedUser, isVerified: newStatus };
      setSelectedUser(updatedUser);
      setUsers(users.map((u) => (u.id === selectedUser.id ? updatedUser : u)));
    } catch (error) {
      toast.error(error.message || "Failed to update verification status");
    } finally {
      setTogglingVerification(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    )
      return;

    try {
      await adminApi.deleteAppUser(app.id, userId);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u.id !== userId));
      if (selectedUser?.id === userId) setUserDetailOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleExport = async () => {
    try {
      toast.loading("Preparing export...", { id: "export" });
      await adminApi.exportUsers(app.id);
      toast.success("Users exported successfully", { id: "export" });
    } catch (error) {
      toast.error("Export failed", { id: "export" });
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
                onClick={handleExport}
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
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                                setEmailModalOpen(true);
                              }}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.id);
                              }}
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0">
          {selectedUser && (
            <div className="flex flex-col h-full overflow-hidden">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  User Details
                </DialogTitle>
                <DialogDescription>
                  View and manage user information and active sessions
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20 p-1">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                      {selectedUser.username
                        ? selectedUser.username.charAt(0).toUpperCase()
                        : selectedUser.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent leading-none mb-1">
                      {selectedUser.username || "No username"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                    <div className="mt-2 text-xs">
                      {getStatusBadge(selectedUser.isVerified)}
                    </div>
                  </div>
                </div>

                <Separator className="opacity-50" />

                {/* User Details Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
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
                                      (session.browser && session.os
                                        ? `${session.browser} on ${session.os}`
                                        : session.browser ||
                                          session.os ||
                                          "Unknown Device")}
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
                                    {session.location &&
                                      `• ${session.location}`}
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
              </div>

              <div className="p-4 bg-muted/30 border-t border-border/50">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/50 h-9"
                    onClick={() => setEmailModalOpen(true)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="hidden xs:inline">Send</span> Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/50 h-9"
                    onClick={() => setResetPasswordOpen(true)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="hidden xs:inline">Reset</span> Password
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/50 h-9"
                    onClick={handleToggleVerification}
                    disabled={togglingVerification}
                  >
                    {togglingVerification ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : selectedUser.isVerified ? (
                      <XCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    {selectedUser.isVerified
                      ? "Unverify Status"
                      : "Verify Status"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-9"
                    onClick={() => handleDeleteUser(selectedUser.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Email Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Custom Email</DialogTitle>
            <DialogDescription>
              Write a personalized message to{" "}
              {selectedUser?.username || "the user"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message Body</label>
              <textarea
                className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background"
                placeholder="Write your message here..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setEmailModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSendEmail} disabled={sendingEmail}>
                {sendingEmail ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              This will reset the password for {selectedUser?.email} and log
              them out of all sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                placeholder="Enter new secure password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setResetPasswordOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleResetPassword}
                disabled={resettingPassword}
              >
                {resettingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Reset Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
