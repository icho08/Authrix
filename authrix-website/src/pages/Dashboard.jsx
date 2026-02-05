import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, Settings, Copy, Trash2, Plus, Code, Key, Shield, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { adminApi } from '../utils/adminApi'

export default function Dashboard() {
  const { user, logout, loading : authloading, baseUrl } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showCreateApp, setShowCreateApp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [appName, setAppName] = useState('')
  const [settingsForm, setSettingsForm] = useState({ name: '', requireEmailVerification: false })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      loadUserApp()
    }
  }, [user])

  const loadUserApp = async () => {
    try {
      setLoading(true)
      const result = await adminApi.getMyApp()
      setApp(result.app)
      if (result.app) {
        setSettingsForm({
          name: result.app.name,
          requireEmailVerification: result.app.requireEmailVerification
        })
      }
    } catch (error) {
      console.error('Failed to load app:', error)
      setError('Failed to load application data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateApp = async (e) => {
    e.preventDefault()
    if (!appName.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const newApp = await adminApi.createApp(appName)
      setApp(newApp)
      setShowCreateApp(false)
      setAppName('')
    } catch (error) {
      console.error('Failed to create app:', error)
      setError(error.message || 'Failed to create application')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSettings = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const updatedApp = await adminApi.updateAppSettings(app.id, settingsForm)
      setApp(prev => ({ ...prev, ...updatedApp }))
      setShowSettings(false)
    } catch (error) {
      console.error('Failed to update settings:', error)
      setError(error.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteApp = async () => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return
    
    setLoading(true)
    setError('')
    
    try {
      await adminApi.deleteApp(app.id)
      setApp(null)
    } catch (error) {
      console.error('Failed to delete app:', error)
      setError(error.message || 'Failed to delete application')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // TODO: Show toast notification
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Authrix</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-600 dark:text-gray-300 font-medium">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{user.username?.[0] || user.email?.[0] || 'U'}</span>
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{user.username || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!app ? (
          // No app created yet
          <div className="text-center py-16">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-6">
              <Plus className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Create Your First Application</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Get started by creating an application to receive your API keys and begin integrating authentication.
            </p>
            <button
              onClick={() => setShowCreateApp(true)}
              className="inline-flex items-center px-8 py-4 border border-transparent shadow-lg text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Application
            </button>
          </div>
        ) : (
          // App exists - show app details
          <div className="space-y-8">
            {/* App Overview */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{app.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Application ID: {app.id}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Active
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">API Key</label>
                    </div>
                    <div className="flex rounded-xl shadow-sm">
                      <input
                        type="text"
                        readOnly
                        value={app.apiKey}
                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(app.apiKey)}
                        className="inline-flex items-center px-4 py-3 border border-l-0 border-gray-200 dark:border-gray-600 rounded-r-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <Shield className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Secret Key</label>
                    </div>
                    <div className="flex rounded-xl shadow-sm">
                      <input
                        type="password"
                        readOnly
                        value={app.secretKey}
                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(app.secretKey)}
                        className="inline-flex items-center px-4 py-3 border border-l-0 border-gray-200 dark:border-gray-600 rounded-r-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Keep your secret key safe and never expose it in client-side code.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center mb-4">
                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Application Settings</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Email Verification</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.requireEmailVerification ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                        {app.requireEmailVerification ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Created</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Status</span>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Production Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Start Guide</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-4">1</span>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Install the SDK</h4>
                  </div>
                  <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 ml-12 border border-gray-700">
                    <code className="text-green-400 text-sm">npm install authrix-sdk</code>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-4">2</span>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Initialize the client</h4>
                  </div>
                  <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 ml-12 border border-gray-700">
                    <pre className="text-green-400 text-sm overflow-x-auto">{`import { AuthClient } from 'authrix-sdk';

const authClient = new AuthClient({
  apiKey: '${app.apiKey}',
  baseUrl: '${baseUrl}'
});`}</pre>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-4">3</span>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Use in your React app</h4>
                  </div>
                  <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 ml-12 border border-gray-700">
                    <pre className="text-green-400 text-sm overflow-x-auto">{`import { useAuth } from 'authrix-sdk';

function App() {
  const { login, user, loading } = useAuth();
  
  return (
    <div>
      {user ? \`Welcome \${user.username}!\` : 
        <button onClick={() => login({ 
          email: 'user@example.com', 
          password: 'password' 
        })}>
          Login
        </button>
      }
    </div>
  );
}`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Application Users</h3>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Total: 0 users</span>
              </div>
              
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users yet</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Users will appear here once they register through your application
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    💡 Tip: Use the SDK integration above to start accepting user registrations
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create App Modal */}
        {showCreateApp && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 w-full max-w-md shadow-2xl rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Application</h3>
              <form onSubmit={handleCreateApp}>
                <div className="mb-6">
                  <label htmlFor="appName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Application Name
                  </label>
                  <input
                    type="text"
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                    placeholder="My Awesome App"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateApp(false)}
                    className="px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl disabled:opacity-50 transition-all transform hover:scale-105"
                  >
                    {loading ? 'Creating...' : 'Create App'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && app && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 w-full max-w-md shadow-2xl rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Application Settings</h3>
              <form onSubmit={handleUpdateSettings}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="settingsName" className="block text-sm font-semibold text-slate-700 mb-2">
                      Application Name
                    </label>
                    <input
                      type="text"
                      id="settingsName"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailVerification"
                      checked={settingsForm.requireEmailVerification}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, requireEmailVerification: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label htmlFor="emailVerification" className="ml-3 text-sm font-medium text-slate-700">
                      Require email verification
                    </label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleDeleteApp}
                    className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Delete App
                  </button>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl disabled:opacity-50 transition-all"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
