"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader2, Plus, Trash2, Eye, Edit2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", deadline: "" });
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user, router]);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      toast.error("প্রজেক্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        deadline: new Date(formData.deadline).toISOString(),
      };
      
      await api.post("/projects", payload);
      toast.success("প্রজেক্ট তৈরি হয়েছে!");
      setIsModalOpen(false);
      setFormData({ title: "", description: "", deadline: "" });
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "তৈরি করতে ব্যর্থ হয়েছে");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("আপনি কি নিশ্চিত এটি ডিলিট করতে চান?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("প্রজেক্ট ডিলিট হয়েছে");
    } catch (error) {
      toast.error("ডিলিট করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">কোনো প্রজেক্ট নেই।</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{p.description}</p>
              <p className="text-xs text-blue-600 mt-2">Deadline: {new Date(p.deadline).toLocaleDateString()}</p>
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => router.push(`/projects/${p.id}`)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
                >
                  <Eye size={14} /> View
                </button>
                <button 
                  onClick={() => {/* এখানে এডিট মডাল ওপেন হবে */}}
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-100 text-blue-600 px-3 py-2 rounded hover:bg-blue-200"
                >
                  <Edit2 size={14} /> Edit
                </button>
              </div>

              <button 
                onClick={(e) => handleDelete(e, p.id)}
                className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ক্রিয়েট মডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreate} className="bg-white p-8 rounded-2xl w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold mb-4">Create Project</h2>
            <input className="w-full p-2 border rounded-lg" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            <input className="w-full p-2 border rounded-lg" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            <input type="date" className="w-full p-2 border rounded-lg" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} required />
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}