const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const getStaffToken = () => {
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('staff_access_token='))
  return tokenCookie ? tokenCookie.split('=')[1] : null
}

const staffRequest = async (endpoint, options = {}) => {
  const token = getStaffToken()
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Staff Request failed')
  }

  return response.json()
}

export const staffApi = {
  login: async (email, password) => {
    const res = await staffRequest('/api/staff/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    // Set cookie
    document.cookie = `staff_access_token=${res.token}; path=/; max-age=86400; SameSite=Lax`
    return res
  },

  getTickets: () => staffRequest('/api/staff/tickets'),
  
  getMessages: (conversationId) => staffRequest(`/api/staff/tickets/${conversationId}/messages`),
  
  sendMessage: (conversationId, content) => staffRequest('/api/staff/tickets/message', {
    method: 'POST',
    body: JSON.stringify({ conversationId, content })
  }),
  
  closeTicket: (conversationId) => staffRequest('/api/staff/tickets/close', {
    method: 'POST',
    body: JSON.stringify({ conversationId })
  }),

  logout: () => {
    document.cookie = 'staff_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}
