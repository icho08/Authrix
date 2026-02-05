"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "@/components/ui/alert-dialog"
import { SettingsIcon, User, Shield, Bell, Trash2, Save, Mail, Key, AlertTriangle, RefreshCw } from "lucide-react"
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { adminApi } from '../../utils/adminApi'
import DomainManagement from '../../components/DomainManagement'

export default function Settings() {
  const { user } = useAuth()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    appName: "",
    requireEmailVerification: false,
  })

  useEffect(() => {
    loadUserApp()
  }, [])

  const loadUserApp = async () => {
    try {
      const result = await adminApi.getMyApp()
      setApp(result.app)
      if (result.app) {
        setSettings({
          appName: result.app.name,
          requireEmailVerification: result.app.requireEmailVerification
        })
      }
    } catch (error) {
      console.error('Failed to load app:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!app) return
    
    setSaving(true)
    try {
      const updatedApp = await adminApi.updateAppSettings(app.id, settings)
      console.log('Updated app:', updatedApp)
      // Update app state with the new settings we just saved
      setApp(prev => ({ 
        ...prev, 
        name: settings.appName,
        requireEmailVerification: settings.requireEmailVerification
      }))
      toast.success('Settings updated successfully!')
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast.error(error.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteApp = async () => {
    if (!app) return
    
    try {
      await adminApi.deleteApp(app.id)
      toast.success('Application deleted successfully')
      setApp(null)
    } catch (error) {
      console.error('Failed to delete app:', error)
      toast.error(error.message || 'Failed to delete application')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <SettingsIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No application found</h3>
          <p className="text-muted-foreground">Create an application first to manage settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Application Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure your application preferences and security</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="appName">Application Name</Label>
              <Input
                id="appName"
                value={settings.appName}
                onChange={(e) => setSettings((prev) => ({ ...prev, appName: e.target.value }))}
              />
            </div>
            <div className="space-y-2 opacity-60">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={24}
                disabled
              />
              <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require users to verify their email before accessing your app
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, requireEmailVerification: checked }))}
              />
            </div>

            <div className="flex items-center justify-between opacity-60">
              <div className="space-y-0.5">
                <Label className="text-base">Allow Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to create accounts</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={true} disabled />
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="pt-6">
          <Button onClick={handleSave} disabled={saving} className="ml-auto gap-2">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Domain Management */}
      <DomainManagement app={app} onUpdate={setApp} />

      {/* Security Settings - Coming Soon */}
      {/* <Card className="opacity-60">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">Security features including password change will be available soon</p>
          </div>
        </CardContent>
      </Card> */}

      {/* Domain Management */}

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div>
              <p className="font-medium">Delete Application</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this application and all associated data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete App
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your application and remove all
                    associated data including users, sessions, and API keys.
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
  )
}
