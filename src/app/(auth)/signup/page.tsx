"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Loader2, User, Mail, Lock, CheckCircle, Shield } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  // প্রাথমিক রোল "MEMBER" (আপনার ডাটাবেসের সাথে সামঞ্জস্যপূর্ণ)
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "MEMBER" });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ব্যাকএন্ডে ডাটা পাঠানোর আগে ডাটা ঠিক আছে কি না চেক করুন
      await api.post("/auth/signup", formData);
      setIsSuccess(true);
      toast.success("Account created successfully!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      console.error(error); // এরর দেখার জন্য
      toast.error(error.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
        
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Select your role to get started.</p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            </div>

            {/* সঠিক রোল অপশন */}
            <div className="relative">
              <Shield className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <select 
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                value={formData.role}
              >
                <option value="MEMBER">User</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            
            <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Sign Up"}
            </button>
          </form>
        </div>
        
        {/* ডানদিকের স্লাইডশো অংশটি একই থাকবে */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 p-10 items-center justify-center text-white text-center">
             {/* ... */}
        </div>
      </div>
    </div>
  );
}