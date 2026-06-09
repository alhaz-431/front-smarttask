"use client";

import { useState, FormEvent, ChangeEvent } from "react";
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      
      // লোকাল স্টোরেজে ডাটা সেট করা
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      toast.success("Welcome back!");

  const role = response.data.user?.role?.toLowerCase();

if (role === "admin") {
  router.push("/admindashboard/admin");
} else if (role === "manager") {
  router.push("/managerdashboard/manager"); // এখানে পাথটি পরিবর্তন করা হয়েছে
} else {
  router.push("/dashboard/projects"); // মেম্বারদের জন্য
}
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* ফর্ম সেকশন */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Login to your account to continue.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })} 
                required 
              />
            </div>
            
            <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account? <Link href="/auth/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
          </p>
        </div>

        {/* সাইড ইমেজ/ভিজ্যুয়াল সেকশন */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 p-10 items-center justify-center text-white text-center">
          <div>
            <LogIn size={100} className="mx-auto mb-4 opacity-80" />
            <h3 className="text-3xl font-bold mb-4">SmartTask Login</h3>
            <p className="opacity-80">Access your dashboard and start managing your tasks efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  );
}