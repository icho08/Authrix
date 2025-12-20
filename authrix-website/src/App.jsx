import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import AuthRedirect from './components/AuthRedirect'
import DashboardLayout from './components/DashboardLayout'
import DocsLayout from './components/DocsLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Pricing from './pages/Pricing'
import Overview from './pages/dashboard/Overview'
import Users from './pages/dashboard/Users'
import Integration from './pages/dashboard/Integration'
import Settings from './pages/dashboard/Settings'
import GettingStarted from './pages/docs/GettingStarted'
import Installation from './pages/docs/Installation'
import AuthClient from './pages/docs/AuthClient'
import ReactHooks from './pages/docs/ReactHooks'
import ApiMethods from './pages/docs/ApiMethods'
import TypeScript from './pages/docs/TypeScript'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/docs" element={<DocsLayout />} />
            <Route path="/docs/:id" element={<DocsLayout />} />
            <Route path="/login" element={
              <AuthRedirect>
                <LoginPage />
              </AuthRedirect>
            } />
            <Route path="/register" element={
              <AuthRedirect>
                <RegisterPage />
              </AuthRedirect>
            } />
            <Route path="/forgot-password" element={
              <AuthRedirect>
                <ForgotPasswordPage />
              </AuthRedirect>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Overview />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/users" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/integration" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Integration />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
