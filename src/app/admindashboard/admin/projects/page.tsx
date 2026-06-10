"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit2, Loader2, X } from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  const [formData, setFormData] = useState({ title: "", description: "", deadline: "" });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err: any) {
      toast.error("প্রজেক্ট লোড করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        deadline: new Date(formData.deadline).toISOString(), // ✅ ISO string
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, payload); // ✅ PUT
        toast.success("প্রজেক্ট আপডেট হয়েছে");
      } else {
        await api.post("/projects", payload);
        toast.success("নতুন প্রজেক্ট তৈরি হয়েছে");
      }
      setIsModalOpen(false);
      setFormData({ title: "", description: "", deadline: "" });
      fetchProjects();
    } catch (err: any) {
      toast.error("অপারেশন ব্যর্থ হয়েছে!");
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই প্রজেক্টটি ডিলিট করতে চান?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("প্রজেক্ট ডিলিট হয়েছে");
      fetchProjects();
    } catch (err) { toast.error("ডিলিট হয়নি"); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <button 
          onClick={() => { 
            setEditingProject(null); 
            setFormData({ title: "", description: "", deadline: "" }); 
            setIsModalOpen(true); 
          }} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2">
          <Plus size={20} /> Create New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64"><Loader2 className="animate-spin" /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">কোনো প্রজেক্ট নেই।</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p: any) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-lg">{p.title}</h3> {/* ✅ title */}
              <p className="text-gray-500 text-sm mb-2">{p.description}</p>
              <p className="text-xs text-blue-600 mb-4">
                Deadline: {new Date(p.deadline).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => { 
                    setEditingProject(p); 
                    setFormData({ 
                      title: p.title,           // ✅ title
                      description: p.description || "", 
                      deadline: p.deadline.split('T')[0] 
                    }); 
                    setIsModalOpen(true); 
                  }} 
                  className="p-2 text-blue-600">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => deleteProject(p.id)} className="p-2 text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
              <Link 
                href={`/admindashboard/admin/projects/${p.id}`} 
                className="block mt-4 text-center py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">{editingProject ? "Edit" : "Create"} Project</h2>
              <X onClick={() => setIsModalOpen(false)} className="cursor-pointer" />
            </div>
            <input 
              className="w-full border p-2 mb-3 rounded" 
              placeholder="Title"           // ✅ Title
              value={formData.title}        // ✅ title
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
            <textarea 
              className="w-full border p-2 mb-3 rounded" 
              placeholder="Description" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <input 
              type="date" 
              className="w-full border p-2 mb-4 rounded" 
              value={formData.deadline} 
              onChange={(e) => setFormData({...formData, deadline: e.target.value})} 
              required 
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
}