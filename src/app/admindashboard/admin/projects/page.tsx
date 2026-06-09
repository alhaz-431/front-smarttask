"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit2, Loader2, Briefcase, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err: any) {
      toast.error("প্রজেক্ট লিস্ট লোড করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই প্রজেক্টটি ডিলিট করতে চান? এটি টাস্কসহ মুছে যাবে।")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("প্রজেক্ট সফলভাবে ডিলিট হয়েছে");
      fetchProjects();
    } catch (err: any) {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
          <p className="text-gray-500">অ্যাডমিন হিসেবে আপনার প্রজেক্টগুলো নিয়ন্ত্রণ করুন</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg">
          <Plus size={20} /> Create New Project
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project: any) => (
              <div key={project.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <Briefcase size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteProject(project.id)} 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-800">{project.name}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{project.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    project.status === 'active' ? 'bg-green-100 text-green-700' : 
                    project.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Calendar size={14} />
                    {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </div>
                
                <Link 
                  href={`/admindashboard/admin/projects/${project.id}`}
                  className="mt-4 block w-full text-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg transition"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400">
              কোনো প্রজেক্ট পাওয়া যায়নি। নতুন প্রজেক্ট তৈরি করুন।
            </div>
          )}
        </div>
      )}
    </div>
  );
}