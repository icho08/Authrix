import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  GitCommit,
  Tag,
  Clock,
  ChevronRight,
  Github,
  Twitter,
  Disc,
} from "lucide-react";
import Header from "../components/Header";

export default function Changelog() {
  const changes = [
    {
      version: "v2.0.0",
      date: "February 5, 2026",
      type: "major",
      title: "The Reimagined Update",
      description:
        "A complete overhaul of the authentication engine with improved performance and a brand new UI.",
      items: [
        "Complete redesign of the landing page and dashboard",
        "Migrated to new high-performance auth nodes",
        "Added support for Passkeys (WebAuthn)",
        'New "Edge" middleware for Next.js users',
        "Reduced bundle size by 40%",
      ],
    },
    {
      version: "v1.9.4",
      date: "January 28, 2026",
      type: "patch",
      title: "Performance Patch",
      description: "Minor updates to improve latency in the APAC region.",
      items: [
        "Optimized database queries for user sessions",
        "Fixed a bug with GitHub OAuth flow",
        "Updated dependencies",
      ],
    },
    {
      version: "v1.9.0",
      date: "January 15, 2026",
      type: "minor",
      title: "Organizations Beta",
      description: "Introducing support for multi-tenant organizations.",
      items: [
        'Added "Organization" resource to the API',
        "Team invitations via email",
        "Role-based access control (RBAC) specifically for orgs",
        "New audit logs for organization events",
      ],
    },
    {
      version: "v1.8.2",
      date: "December 20, 2025",
      type: "patch",
      title: "Holiday Fixes",
      description: "Squashing bugs before the holidays.",
      items: [
        "Fixed dark mode flickering on initial load",
        " improved error messages for invalid passwords",
      ],
    },
  ];

  return (
    <div className="dark min-h-screen bg-[#05050A] text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
      </div>

      <Header variant="default" breadcrumb="Changelog" />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="mb-16">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Changelog</h1>
          <p className="text-xl text-zinc-400">
            Keep track of all the updates and improvements to Authrix.
          </p>
        </div>

        <div className="space-y-12">
          {changes.map((change, i) => (
            <div key={i} className="relative pl-8 md:pl-0">
              {/* Timeline Line (Desktop) */}
              <div className="hidden md:block absolute left-[150px] top-0 bottom-0 w-px bg-white/10"></div>

              <div className="md:flex gap-12 group">
                {/* Meta Info */}
                <div className="hidden md:block w-[150px] text-right shrink-0 pt-2">
                  <div className="text-sm font-mono text-primary font-bold mb-2">
                    {change.version}
                  </div>
                  <div className="text-xs text-zinc-500 flex items-center justify-end gap-1">
                    <Calendar className="w-3 h-3" />
                    {change.date}
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-[-5px] md:left-[146px] top-[10px] w-[9px] h-[9px] rounded-full bg-primary ring-4 ring-[#05050A] group-hover:scale-125 transition-transform z-10"></div>

                {/* Content */}
                <div className="flex-1 pb-12 border-b border-white/5 last:border-0">
                  <div className="md:hidden flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono font-bold border border-primary/20">
                      {change.version}
                    </span>
                    <span className="text-xs text-zinc-500">{change.date}</span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {change.title}
                  </h2>
                  <p className="text-zinc-400 mb-6 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 inline-block">
                    {change.description}
                  </p>

                  <ul className="space-y-3">
                    {change.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-zinc-300"
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-[#05050A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-violet-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Authrix</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2025 Authrix Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
