import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { adminApi } from '../utils/adminApi'

export default function Dashboard() {
  const { user, logout, loading: authLoading, baseUrl } = useAuth()
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Authrix</span>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <span className="text-slate-600 font-medium">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">{user.username?.[0] || user.email?.[0] || 'U'}</span>
                </div>
                <span className="text-slate-700 font-medium">{user.username || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!app ? (
          // No app created yet
          <div className="text-center py-16">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 mb-6">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Create Your First Application</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Get started by creating an application to receive your API keys and begin integrating authentication.
            </p>
            <button
              onClick={() => setShowCreateApp(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            >
              <svg className="-ml-1 mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Application
            </button>
          </div>
        ) : (
          // App exists - show app details
          <div className="space-y-8">
            {/* App Overview */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{app.name}</h2>
                  <p className="text-slate-600">Application ID: {app.id}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Settings
                  </button>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Active
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">API Key</label>
                    <div className="flex rounded-xl shadow-sm">
                      <input
                        type="text"
                        readOnly
                        value={app.apiKey}
                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(app.apiKey)}
                        className="inline-flex items-center px-4 py-3 border border-l-0 border-slate-200 rounded-r-xl bg-slate-50 text-slate-600 text-sm hover:bg-slate-100 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Secret Key</label>
                    <div className="flex rounded-xl shadow-sm">
                      <input
                        type="password"
                        readOnly
                        value={app.secretKey}
                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(app.secretKey)}
                        className="inline-flex items-center px-4 py-3 border border-l-0 border-slate-200 rounded-r-xl bg-slate-50 text-slate-600 text-sm hover:bg-slate-100 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      Keep your secret key safe and never expose it in client-side code.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Application Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Email Verification</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.requireEmailVerification ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {app.requireEmailVerification ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Created</span>
                      <span className="text-sm text-slate-600">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Start Guide</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                    Install the SDK
                  </h4>
                  <div className="bg-slate-900 rounded-xl p-4 ml-9">
                    <code className="text-green-400 text-sm">npm install authrix-sdk</code>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                    Initialize the client
                  </h4>
                  <div className="bg-slate-900 rounded-xl p-4 ml-9">
                    <pre className="text-green-400 text-sm overflow-x-auto">{`import { AuthClient } from 'authrix-sdk';

const authClient = new AuthClient({
  apiKey: '${app.apiKey}',
  baseUrl: '${baseUrl}'
});`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                    Use in your React app
                  </h4>
                  <div className="bg-slate-900 rounded-xl p-4 ml-9">
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
