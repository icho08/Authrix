import { Link } from 'react-router-dom'
import { 
  Shield, 
  Zap, 
  Code, 
  Users, 
  Lock, 
  Smartphone,
  ArrowRight,
  Check,
  Github,
  Play,
  ChevronRight
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Authrix</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Authentication-as-a-Service
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Ship Auth in
              <span className="text-blue-600 block">Minutes, Not Weeks</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Production-ready authentication with multi-tenant support. 
              Focus on building your product while we handle user management, security, and compliance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Start for Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to authenticate users</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade features that scale from startup to enterprise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Complete Auth Flow",
                description: "Registration, login, password reset, email verification, and multi-factor authentication"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Multi-Tenant Architecture",
                description: "Isolate users by application with API keys. Perfect for SaaS and B2B platforms"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast Performance",
                description: "Built on modern infrastructure with global CDN and 99.9% uptime SLA"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise Security",
                description: "SOC 2 compliant with JWT tokens, rate limiting, and advanced threat protection"
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Developer Experience",
                description: "React SDK with TypeScript, comprehensive docs, and webhook support"
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Session Management",
                description: "Multi-device support, selective logout, device tracking, and session analytics"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get started in minutes</h2>
            <p className="text-xl text-gray-600">Three simple steps to production-ready authentication</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Create Your Account",
                description: "Sign up for free and verify your email to access the dashboard",
                icon: <Users className="w-6 h-6" />
              },
              {
                step: "2", 
                title: "Configure Your App",
                description: "Create your application and get API keys with custom settings",
                icon: <Code className="w-6 h-6" />
              },
              {
                step: "3",
                title: "Integrate & Deploy",
                description: "Install our SDK and start authenticating users in production",
                icon: <Zap className="w-6 h-6" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {item.icon}
                </div>
                <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-6 w-6 h-6 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Simple. Powerful. Ready.</h2>
            <p className="text-xl text-gray-300">Add authentication with just a few lines of code</p>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="ml-4 text-gray-400 text-sm font-mono">App.jsx</span>
            </div>
            <pre className="text-green-400 text-sm leading-relaxed overflow-x-auto font-mono">
{`import { useAuth } from 'authrix-sdk';

function App() {
  const { login, user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login({ 
          email: 'user@example.com', 
          password: 'password' 
        })}>
          Login
        </button>
      )}
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to ship faster?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who chose Authrix to handle authentication 
            so they can focus on building amazing products.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Start Building Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center space-x-2">
              <Github className="w-5 h-5" />
              <a href='https://github.com/icho08/Authsystem'>View on GitHub</a>
            </button>
          </div>
        </div>
      </section>

      
    </div>
  )
}
