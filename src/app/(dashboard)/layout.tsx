"use client";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-lg">
        <nav className="mt-6">
          <a href="/dashboard/projects" className="block py-3 px-6">Projects</a>
          
          {/* শুধু ADMIN এর জন্য */}
          {role === 'ADMIN' && (
            <a href="/dashboard/users" className="block py-3 px-6 text-red-600">User Management (Admin Only)</a>
          )}
          
          {/* MANAGER এবং ADMIN এর জন্য */}
          {(role === 'MANAGER' || role === 'ADMIN') && (
            <a href="/dashboard/reports" className="block py-3 px-6">Reports</a>
          )}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}