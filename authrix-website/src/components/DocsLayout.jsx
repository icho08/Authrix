import { Outlet, useParams, Link } from "react-router-dom";
import { Shield, Code, Book, ChevronRight } from "lucide-react";
import GettingStarted from "../pages/docs/GettingStarted";
import Installation from "../pages/docs/Installation";
import AuthClient from "../pages/docs/AuthClient";
import ReactHooks from "../pages/docs/ReactHooks";
import ApiMethods from "../pages/docs/ApiMethods";
import TypeScript from "../pages/docs/TypeScript";
import Header from "./Header";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    component: GettingStarted,
  },
  {
    id: "installation",
    title: "Installation",
    icon: Code,
    component: Installation,
  },
  {
    id: "auth-client",
    title: "AuthClient",
    icon: Shield,
    component: AuthClient,
  },
  {
    id: "react-hooks",
    title: "React Hooks",
    icon: Code,
    component: ReactHooks,
  },
  {
    id: "api-methods",
    title: "API Methods",
    icon: Book,
    component: ApiMethods,
  },
  { id: "typescript", title: "TypeScript", icon: Code, component: TypeScript },
];

export default function DocsLayout() {
  const { id } = useParams();
  const currentSection = sections.find((s) => s.id === id) || sections[0];
  const CurrentComponent = currentSection.component;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header variant="docs" breadcrumb="Documentation" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  const isActive = section.id === (id || "getting-started");
                  return (
                    <Link
                      key={section.id}
                      to={`/docs/${section.id}`}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {section.title}
                    </Link>
                  );
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
  );
}
