import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { Shield } from 'lucide-react'
export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1: email, 2: code + password
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const { requestPasswordReset, resetPassword, loading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email) {
      setError('Please enter your email address')
      return
    }

    try {
      await requestPasswordReset(formData.email)
      setStep(2)
      toast.success('Reset code sent! Check your email.', {
        duration: 5000,
        icon: '📧'
      })
    } catch (err) {
      setError(err.message || 'Failed to send reset code. Please try again.')
      toast.error(err.message || 'Failed to send reset code')
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.code || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      await resetPassword(formData.code, formData.password)
      toast.success('Password reset successfully! You can now log in with your new password.')
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please try again.')
      toast.error(err.message || 'Invalid or expired code')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center space-x-2 mb-8">
          <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-background" />
            </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Authrix</h1>
        </Link>
        
        <div className="text-center">
          {step === 1 ? (
            <>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot your password?</h2>
              <p className="text-slate-600">
                Enter your email address and we'll send you a reset code.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Enter reset code</h2>
              <p className="text-slate-600">
                We sent a 6-digit code to <strong>{formData.email}</strong>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-10 px-8 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-200/60">
          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleEmailSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                  placeholder="Enter your email"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Code'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleResetSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="code" className="block text-sm font-semibold text-slate-700 mb-2">
                  Reset Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  maxLength="6"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Resetting...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                >
                  ← Use different email
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-500 font-medium text-sm transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
