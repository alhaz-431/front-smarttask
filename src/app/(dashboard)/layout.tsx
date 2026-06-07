"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FolderKanban, Settings, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // প্রোটেকশন গার্ড: লগইন চেক করা
  useEffect(() => {
    // এখানে আমরা চেক করছি লোকাল স্টোরেজে বা কুকিতে টোকেন আছে কি না
    // তুমি যদি কুকি ব্যবহার করো তবে কুকি চেক করো, টোকেন হলে localStorage.getItem('token')
    const token = localStorage.getItem("token"); 
    
    if (!token) {
      toast.error("Please login to access the dashboard!");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // টোকেন রিমুভ করা
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">SmartTask</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard/projects" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${pathname.includes('/projects') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FolderKanban size={20} /> Projects
          </Link>
          <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${pathname.includes('/settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings size={20} /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
          <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-700 capitalize">
            {pathname.split('/').pop()}
          </span>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}