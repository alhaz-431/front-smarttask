"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Backdrop (mobile only) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
          flex flex-col transform transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:flex
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* Logo + close button (close only visible on mobile) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="font-bold text-xl text-blue-600 tracking-tight">
            SmartTask
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  group flex items-center gap-3 px-4 py-2.5 rounded-lg
                  transition-all duration-150 text-sm font-medium
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}
                />
                <span className="flex-1">{link.name}</span>
                {isActive && (
                  <ChevronRight size={14} className="text-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user area (optional, easy to extend) */}
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">v1.0.0</p>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — only visible on mobile for the hamburger */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold text-blue-600 text-lg tracking-tight">
            SmartTask
          </span>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}