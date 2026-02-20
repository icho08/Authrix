const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const getAccessToken = () => {
  const nameEQ = "auth_access_token=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const staffRequest = async (endpoint, options = {}) => {
  const token = getAccessToken()
  
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
    // Standard logout handles everything
  }
}
