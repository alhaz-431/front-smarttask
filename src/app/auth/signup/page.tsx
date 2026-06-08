"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Loader2, User, Mail, Lock, CheckCircle, Shield, Briefcase, Users, Zap } from "lucide-react";
import { toast } from "react-hot-toast";

const slides = [
  { icon: <Briefcase size={80} />, title: "Manage Your Projects", desc: "Organize your tasks and track progress effortlessly." },
  { icon: <Users size={80} />, title: "Team Collaboration", desc: "Work together with your team, assign tasks, and achieve goals." },
  { icon: <Zap size={80} />, title: "Boost Productivity", desc: "Streamline your workflow and stay ahead of deadlines." },
];

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "MEMBER" });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isSuccess]);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", formData);
      setIsSuccess(true);
      toast.success("Account created successfully!");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error: any) {
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
            <InputField icon={<User size={18} />} placeholder="Full Name" onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} />
            <InputField type="email" icon={<Mail size={18} />} placeholder="Email Address" onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })} />
            <InputField type="password" icon={<Lock size={18} />} placeholder="Password" onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })} />
            
            <div className="relative">
              <Shield className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <select className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value })} value={formData.role}>
                <option value="MEMBER">User</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            
            <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">Already have an account? <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">Login</Link></p>
        </div>

        <div className="hidden lg:flex w-1/2 bg-blue-600 p-10 items-center justify-center text-white">
          {isSuccess ? (
             <div className="text-center"><CheckCircle size={100} className="mx-auto mb-4" /><h3>Welcome Aboard!</h3></div>
          ) : (
            <div className="text-center transition-all duration-700">
              <div className="mb-6 opacity-80 flex justify-center">{slides[currentSlide].icon}</div>
              <h3 className="text-3xl font-bold mb-4">{slides[currentSlide].title}</h3>
              <p className="opacity-80">{slides[currentSlide].desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3.5 text-gray-400">{icon}</div>
      <input {...props} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
    </div>
  );
}