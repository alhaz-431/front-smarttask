"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuth(); // ইউজার ডাটা নিলাম
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // কুকি ডিলিট
    setUser(null); // স্টেট খালি করা
    router.push("/login");
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
                <Link href="/dashboard/projects" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition">Login</Link>
                <Link href="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link href="/" className="block text-gray-600">Home</Link>
          {user ? (
            <button onClick={handleLogout} className="block text-red-500">Logout</button>
          ) : (
            <>
              <Link href="/login" className="block text-gray-600">Login</Link>
              <Link href="/signup" className="block bg-blue-600 text-white p-2 rounded text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}