"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // আপনার ব্যাকএন্ডে এমন একটি রুট থাকতে হবে যা এই স্ট্যাটগুলো পাঠাবে
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        toast.error("স্ট্যাটস লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500">Active Projects</h3>
          <p className="text-3xl font-bold mt-2">{stats.activeProjects}</p>
        </div>
        
        {/* Completed Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500">Completed Tasks</h3>
          <p className="text-3xl font-bold mt-2">{stats.completedTasks}</p>
        </div>
        
        {/* Pending Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500">Pending Tasks</h3>
          <p className="text-3xl font-bold mt-2">{stats.pendingTasks}</p>
        </div>
      </div>
    </div>
  );
}