"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    router.push("/auth/login");
  };

  // রোল অনুযায়ী সঠিক পাথ নির্ধারণ
  const getDashboardPath = () => {
    if (!user) return "/auth/login";
    const role = user.role?.toLowerCase();
    if (role === 'admin') return "/admindashboard/admin";
    if (role === 'manager') return "/managerdashboard/manager";
    return "/memberdashboard/projects"; // আপনার নতুন সঠিক পাথ
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">SmartTask</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
            
            {user ? (
              <>
                <Link href={getDashboardPath()} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>

                {/* Admin-এর জন্য অতিরিক্ত লিঙ্ক */}
                {user.role?.toLowerCase() === 'admin' && (
                  <div className="flex gap-3 border-l pl-4">
                    <Link href="/managerdashboard/manager" className="text-xs text-green-600 hover:underline">Manager</Link>
                    <Link href="/memberdashboard/projects" className="text-xs text-orange-600 hover:underline">Member</Link>
                  </div>
                )}

                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 transition">Login</Link>
                <Link href="/auth/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-lg">
          <Link href="/" onClick={() => setIsOpen(false)} className="block text-gray-600">Home</Link>
          {user ? (
            <>
              <Link href={getDashboardPath()} onClick={() => setIsOpen(false)} className="block text-blue-600 font-bold">My Dashboard</Link>
              {/* মোবাইল মেনুতেও অ্যাডমিন অপশন */}
              {user.role?.toLowerCase() === 'admin' && (
                <>
                  <Link href="/managerdashboard/manager" onClick={() => setIsOpen(false)} className="block text-green-600">Manager Dashboard</Link>
                  <Link href="/memberdashboard/projects" onClick={() => setIsOpen(false)} className="block text-orange-600">Member Dashboard</Link>
                </>
              )}
              <button onClick={handleLogout} className="block text-red-500 w-full text-left">Logout</button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block text-gray-600">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}