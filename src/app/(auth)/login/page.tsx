"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Loader2, Mail, Lock, LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/components/auth/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      
      // টোকেন ও ইউজার সেট করা
      document.cookie = `token=${response.data.token}; path=/; max-age=86400; SameSite=Strict`;
      setUser(response.data.user);
      toast.success("Welcome back!");

      // রোল অনুযায়ী রিডাইরেকশন লজিক
      const role = response.data.user?.role;
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "manager") router.push("/dashboard/manager");
      else router.push("/dashboard/projects"); // ডিফল্ট পাথ
      
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
        
        {/* বাম পাশ: ফর্ম */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="email" placeholder="Email Address" className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="password" placeholder="Password" className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            </div>
            <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account? <Link href="/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
          </p>
        </div>

        {/* ডান পাশ: ভিজ্যুয়াল স্লাইড */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center text-white p-8 text-center">
          <div>
            <LogIn size={80} className="mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold">SmartTask Login</h3>
            <p className="text-blue-100 mt-2">Access your dashboard and start managing your tasks efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  );
}