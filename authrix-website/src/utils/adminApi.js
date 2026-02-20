const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const apiKey = import.meta.env.VITE_API_KEY || ''

const getAuthToken = () => {
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_access_token='))
  return tokenCookie ? tokenCookie.split('=')[1] : null
}

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

export const adminApi = {
  createApp: async (name) => {
    // Server returns: { apiKey, secretKey, appId, name, requireEmailVerification }
    const result = await apiRequest('/api/admin/apps', {
      method: 'POST',
      body: JSON.stringify({ name })
    })
    
    // Transform to match expected format
    return {
      id: result.appId,
      name: result.name,
      apiKey: result.apiKey,
      secretKey: result.secretKey,
      requireEmailVerification: result.requireEmailVerification,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  getMyApps: () => apiRequest('/api/admin/apps/me'),

  updateAppSettings: (appId, settings) => apiRequest('/api/admin/apps/update-settings', {
    method: 'POST',
    body: JSON.stringify({ 
      appId, 
      name: settings.appName,
      requireEmailVerification: settings.requireEmailVerification,
      allowedDomains: settings.allowedDomains
    })
  }),

  deleteApp: (appId) => apiRequest('/api/admin/apps/delete', {
    method: 'POST',
    body: JSON.stringify({ appId })
  }),

  getAppUsers: (appId) => apiRequest('/api/admin/apps/application-users', {
    method: 'POST',
    body: JSON.stringify({ appId })
  }),

  getUserSessions: (userId) => apiRequest('/api/admin/apps/user-sessions', {
    method: 'POST',
    body: JSON.stringify({ userId })
  }),

  addDomain: (appId, domain) => apiRequest('/api/admin/apps/domains/add', {
    method: 'POST',
    body: JSON.stringify({ appId, domain })
  }),

  removeDomain: (appId, domain) => apiRequest('/api/admin/apps/domains/remove', {
    method: 'POST',
    body: JSON.stringify({ appId, domain })
  }),

  changePassword: (oldPassword, newPassword) => apiRequest('/api/auth/reset', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword })
  }),
  deleteUserAccount: () => apiRequest('/api/auth/delete-account', {
    method: 'POST'
  }), 
  getActiveSessions: (appId) => apiRequest('/api/admin/apps/active-sessions', {
    method: 'POST',
    body: JSON.stringify({ appId })
  }),
  toggleRegistration: (appId, allowed) => apiRequest('/api/admin/apps/toggle-registration', {
    method: 'POST',
    body: JSON.stringify({ appId, allowed })
  }),
  startVulnerabilityScan: (appId, domain) => apiRequest('/api/admin/apps/vulnerability/scan', {
    method: 'POST',
    body: JSON.stringify({ appId, domain })
  }),
  getVulnerabilityScanResult: (scanId) => apiRequest(`/api/admin/apps/vulnerability/result/${scanId}`, {
    method: 'GET'
  }),
  analyzeVulnerabilityScan: (scanId) => apiRequest('/api/admin/apps/vulnerability/analyze', {
    method: 'POST',
    body: JSON.stringify({ scanId })
  }),

  // User Management
  sendCustomEmail: (appId, userId, subject, body) => apiRequest('/api/admin/users/send-email', {
    method: 'POST',
    body: JSON.stringify({ appId, userId, subject, body })
  }),

  resetUserPassword: (appId, userId, newPassword) => apiRequest('/api/admin/users/reset-password', {
    method: 'POST',
    body: JSON.stringify({ appId, userId, newPassword })
  }),

  toggleUserVerification: (appId, userId, isVerified) => apiRequest('/api/admin/users/toggle-verification', {
    method: 'POST',
    body: JSON.stringify({ appId, userId, isVerified })
  }),

  deleteAppUser: (appId, userId) => apiRequest('/api/admin/users/delete', {
    method: 'POST',
    body: JSON.stringify({ appId, userId })
  }),

  regenerateApiKey: (appId) => apiRequest('/api/admin/apps/regenerate-api-key', {
    method: 'POST',
    body: JSON.stringify({ appId })
  }),

  exportUsers: async (appId) => {
    const token = getAuthToken()
    const response = await fetch(`${baseUrl}/api/admin/users/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ appId })
    })

    if (!response.ok) throw new Error('Export failed')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export_${new Date().getTime()}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
  },

  // Generic helpers
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  closeConversation: (conversationId) => apiRequest('/api/chat/close', {
    method: 'POST',
    body: JSON.stringify({ conversationId })
  })
}
