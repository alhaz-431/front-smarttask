"use client";
import { useAuth } from "@/components/auth/AuthContext";
import Link from "next/link";
import { FolderKanban, Users, ClipboardList } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const menuItems = [
    { name: "Projects", href: "/dashboard/projects", icon: <FolderKanban size={20} />, roles: ["admin", "manager", "member"] },
    { name: "Team Members", href: "/dashboard/team", icon: <Users size={20} />, roles: ["admin", "manager"] },
    { name: "All Tasks", href: "/dashboard/tasks", icon: <ClipboardList size={20} />, roles: ["admin"] },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600">Dashboard</h2>
          <p className="text-xs text-gray-400 capitalize">{user?.role ?? "Guest"} Mode</p>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          {menuItems.map((item) => (
             item.roles.includes(user?.role ?? "") && (
              <Link key={item.name} href={item.href} className="flex items-center gap-3 p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          ))}
        </nav>
      </aside>
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}