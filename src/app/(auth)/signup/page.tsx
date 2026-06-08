"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Loader2, User, Mail, Lock, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // সাকসেস স্টেট
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", formData);
      setIsSuccess(true); // স্লাইডশো ট্রিগার হবে
      toast.success("Account created successfully!");
      setTimeout(() => router.push("/login"), 3000); // ৩ সেকেন্ড পর রিডাইরেক্ট
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* বাম পাশ: ফর্ম */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Join SmartTask to manage projects efficiently.</p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            {/* বাকি ইনপুটগুলো এখানে একইভাবে থাকবে */}
            
            <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Sign Up"}
            </button>
          </form>
        </div>

        {/* ডান পাশ: স্লাইডশো/সাকসেস মেসেজ */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 p-10 items-center justify-center text-white text-center">
          {isSuccess ? (
            <div className="animate-bounce">
              <CheckCircle size={100} className="mb-4" />
              <h3 className="text-2xl font-bold">Welcome Aboard!</h3>
              <p>Your account is ready.</p>
            </div>
          ) : (
            <div>
              <h3 className="text-3xl font-bold mb-4">Manage Your Tasks</h3>
              <p className="opacity-80">Organize your projects, collaborate with teams, and boost your productivity with SmartTask.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}