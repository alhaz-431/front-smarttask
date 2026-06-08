"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader2, Plus, Trash2, Edit2, X } from "lucide-react";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // প্রজেক্ট ফেচ করা
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error: any) {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // প্রজেক্ট ডিলিট করা
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted.");
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  // প্রজেক্ট তৈরি করা
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/projects", formData);
      toast.success("Project created!");
      setIsModalOpen(false);
      fetchProjects(); // লিস্ট রিফ্রেশ করা
    } catch (error) {
      toast.error("Failed to create.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* মডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">New Project</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input className="w-full p-2 border rounded" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <textarea className="w-full p-2 border rounded" placeholder="Description" onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <button className="w-full bg-blue-600 text-white py-2 rounded">Create</button>
            </form>
          </div>
        </div>
      )}

      {/* প্রজেক্ট গ্রিড */}
      {loading ? (
        <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p._id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-gray-600 mt-2 text-sm">{p.description}</p>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{p.status || "Active"}</span>
                <div className="flex gap-3">
                  <button className="text-blue-600"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}