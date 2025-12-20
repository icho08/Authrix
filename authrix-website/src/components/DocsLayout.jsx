import { Outlet, useParams, Link } from 'react-router-dom'
import { Shield, Code, Book, ChevronRight } from 'lucide-react'
import GettingStarted from '../pages/docs/GettingStarted'
import Installation from '../pages/docs/Installation'
import AuthClient from '../pages/docs/AuthClient'
import ReactHooks from '../pages/docs/ReactHooks'
import ApiMethods from '../pages/docs/ApiMethods'
import TypeScript from '../pages/docs/TypeScript'

const sections = [
  { id: 'getting-started', title: 'Getting Started', icon: Book, component: GettingStarted },
  { id: 'installation', title: 'Installation', icon: Code, component: Installation },
  { id: 'auth-client', title: 'AuthClient', icon: Shield, component: AuthClient },
  { id: 'react-hooks', title: 'React Hooks', icon: Code, component: ReactHooks },
  { id: 'api-methods', title: 'API Methods', icon: Book, component: ApiMethods },
  { id: 'typescript', title: 'TypeScript', icon: Code, component: TypeScript },
]

export default function DocsLayout() {
  const { id } = useParams()
  const currentSection = sections.find(s => s.id === id) || sections[0]
  const CurrentComponent = currentSection.component

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <Link to="/" className="text-xl font-semibold text-foreground tracking-tight">
                Authrix
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Documentation</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link 
                to="https://github.com/icho08/Authsystem" 
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-foreground hover:bg-foreground/90 text-background px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const IconComponent = section.icon
                  const isActive = section.id === (id || 'getting-started')
                  return (
                    <Link
                      key={section.id}
                      to={`/docs/${section.id}`}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {section.title}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <CurrentComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
