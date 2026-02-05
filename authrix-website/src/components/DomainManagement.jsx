import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Globe } from "lucide-react"
import toast from 'react-hot-toast'
import { adminApi } from '../utils/adminApi'

export default function DomainManagement({ app, onUpdate }) {
  const [newDomain, setNewDomain] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddDomain = async (e) => {
    e.preventDefault()
    if (!newDomain.trim() || !app) return

    // Basic validation
    if (!newDomain.match(/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?$/)) {
      toast.error('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setLoading(true)
    try {
      const result = await adminApi.addDomain(app.id, newDomain.trim())
      toast.success('Domain added successfully!')
      setNewDomain('')
      // Update parent component with new domains
      onUpdate({ ...app, allowedDomains: result.allowedDomains })
    } catch (error) {
      toast.error(error.message || 'Failed to add domain')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveDomain = async (domain) => {
    if (!app) return

    setLoading(true)
    try {
      const result = await adminApi.removeDomain(app.id, domain)
      toast.success('Domain removed successfully!')
      // Update parent component with new domains
      onUpdate({ ...app, allowedDomains: result.allowedDomains })
    } catch (error) {
      toast.error(error.message || 'Failed to remove domain')
    } finally {
      setLoading(false)
    }
  }

  if (!app) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Allowed Domains
        </CardTitle>
        <CardDescription>
          Configure which domains can make requests to your application. CORS will automatically allow these domains.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Domain Form */}
        <form onSubmit={handleAddDomain} className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="domain" className="sr-only">Domain URL</Label>
            <Input
              id="domain"
              type="url"
              placeholder="https://example.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !newDomain.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </Button>
        </form>

        {/* Current Domains */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Domains ({app.allowedDomains?.length || 0})</Label>
          {app.allowedDomains && app.allowedDomains.length > 0 ? (
            <div className="space-y-2">
              {app.allowedDomains.map((domain, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{domain}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveDomain(domain)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No domains configured</p>
              <p className="text-xs mt-1">Add domains to enable CORS for your application</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Localhost domains are automatically allowed during development. 
            Production domains must be explicitly added here.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
