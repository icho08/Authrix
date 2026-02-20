"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  SettingsIcon,
  Shield,
  Trash2,
  Save,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Clock,
  UserPlus,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { adminApi } from "../../utils/adminApi";
import DomainManagement from "../../components/DomainManagement";

export default function Settings() {
  const { user } = useAuth();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    appName: "",
    requireEmailVerification: false,
    registrationAllowed: false,
  });

  const [regenerating, setRegenerating] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    loadUserApp();
  }, []);

  const loadUserApp = async () => {
    try {
      const result = await adminApi.getMyApps();
      const userApps = result.apps || [];
      const selectedId = localStorage.getItem("selectedAppId");
      const currentApp =
        userApps.find((a) => a.id === selectedId) || userApps[0];

      setApp(currentApp);

      if (currentApp) {
        setSettings({
          appName: currentApp.name,
          requireEmailVerification: currentApp.requireEmailVerification,
          registrationAllowed: currentApp.isRegistrationOpen,
        });
      }
    } catch (error) {
      console.error("Failed to load apps:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!app) return;

    setSaving(true);
    try {
      const updatedApp = await adminApi.updateAppSettings(app.id, settings);
      setApp((prev) => ({
        ...prev,
        name: settings.appName,
        requireEmailVerification: settings.requireEmailVerification,
      }));
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error(error.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteApp = async () => {
    if (!app) return;

    try {
      await adminApi.deleteApp(app.id);
      toast.success("Application deleted successfully");
      setApp(null);
    } catch (error) {
      console.error("Failed to delete app:", error);
      toast.error(error.message || "Failed to delete application");
    }
  };

  const handleToggleRegistration = async () => {
    if (!app) return;

    try {
      const updatedApp = await adminApi.toggleRegistration(
        app.id,
        !app.registrationAllowed,
      );
      setApp((prev) => ({
        ...prev,
        registrationAllowed: !prev.registrationAllowed,
      }));
      toast.success("Registration toggled successfully!");
    } catch (error) {
      console.error("Failed to toggle registration:", error);
      toast.error(error.message || "Failed to toggle registration");
    }
  };

  const handleRegenerateApiKey = async () => {
    if (!app) return;

    setRegenerating(true);
    try {
      const result = await adminApi.regenerateApiKey(app.id);
      setApp((prev) => ({
        ...prev,
        apiKey: result.apiKey,
      }));
      toast.success("API Key regenerated successfully!");
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
      toast.error(error.message || "Failed to regenerate API key");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">
            Loading settings...
          </span>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
            <SettingsIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No application found</h3>
          <p className="text-muted-foreground text-sm">
            Create an application first to manage settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">App Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your application preferences and security
        </p>
      </div>

      {/* General Settings */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>General</CardTitle>
              <CardDescription>Basic application configuration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator className="opacity-50" />
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="appName">Application Name</Label>
            <Input
              id="appName"
              value={settings.appName}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, appName: e.target.value }))
              }
              className="max-w-md border-border/50 bg-muted/30"
            />
          </div>

          <Separator className="opacity-50" />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Email Verification
                </Label>
                <p className="text-sm text-muted-foreground">
                  Require users to verify their email before accessing your app
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={async (checked) => {
                  const newSettings = {
                    ...settings,
                    requireEmailVerification: checked,
                  };
                  setSettings(newSettings);
                  try {
                    await adminApi.updateAppSettings(app.id, newSettings);
                    setApp((prev) => ({
                      ...prev,
                      requireEmailVerification: checked,
                    }));
                    toast.success(
                      checked
                        ? "Email verification enabled"
                        : "Email verification disabled",
                    );
                  } catch (error) {
                    setSettings((prev) => ({
                      ...prev,
                      requireEmailVerification: !checked,
                    }));
                    toast.error("Failed to update email verification");
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 " />
                <Label className="text-sm font-medium">
                  Registration Toggle
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Control whether new users can create accounts
              </p>
            </div>
            <Switch
              checked={settings.registrationAllowed}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  registrationAllowed: checked,
                }))
              }
            />
          </div>
        </CardContent>
        <Separator className="opacity-50" />
      </Card>

      {/* API Configuration */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage your application's API credentials
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator className="opacity-50" />
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    readOnly
                    type={showApiKey ? "text" : "password"}
                    value={app.apiKey}
                    className="font-mono bg-muted/50 border-border/50 pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(app.apiKey);
                    toast.success("Copied to clipboard!");
                  }}
                  className="shrink-0 h-9"
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This key is used to authenticate requests to the Authrix API.
              </p>
            </div>

            <Separator className="opacity-30" />

            <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <div className="space-y-0.5">
                <p className="font-medium text-sm">Regenerate API Key</p>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                  Rotating your API key will immediately invalidate the old one.
                  Your existing integrations will stop working until updated.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                    disabled={regenerating}
                  >
                    {regenerating ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Regenerate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Rotate API Key?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently invalidate your current API
                      key. Any services using this key will experience downtime
                      until they are updated with the new key.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRegenerateApiKey}
                      className="bg-amber-500 text-white hover:bg-amber-600"
                    >
                      Yes, Regenerate Key
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
      <DomainManagement app={app} onUpdate={setApp} />

      {/* Coming Soon Features */}
      {/* <Card className="border-border/30 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
              <Sparkles className="h-5 w-5 text-violet-500 dark:text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Upcoming Features</CardTitle>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Soon
                </Badge>
              </div>
              <CardDescription>
                These features are being worked on and will be available soon
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator className="opacity-30" />
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/20 opacity-60">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Session Timeout</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Configure how long sessions stay active
              </p>
            </div>
            <Input
              type="number"
              value={24}
              disabled
              className="w-20 text-center bg-muted/30 border-border/30"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/20 opacity-60">
            <Switch checked={true} disabled />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/20 opacity-60">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Rate Limiting</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Protect your API with request rate limits
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs border-border/30 text-muted-foreground"
            >
              Off
            </Badge>
          </div>
        </CardContent>
      </Card> */}

      {/* Danger Zone */}
      <Card className="border-destructive/30 bg-destructive/[0.02]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 ring-1 ring-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator className="opacity-30" />
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
            <div>
              <p className="font-medium text-sm">Delete Application</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete this application and all associated data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2 shadow-lg shadow-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete App
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your application and remove all associated data including
                    users, sessions, and API keys.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteApp}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Application
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
