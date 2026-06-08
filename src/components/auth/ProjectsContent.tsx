"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader2, Plus, Trash2, Edit2, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error: any) {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project deleted.");
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/projects", { ...formData, deadline: new Date() }); // ডেডলাইন যোগ করুন
      toast.success("Project created!");
      setIsModalOpen(false);
      setFormData({ title: "", description: "" });
      fetchProjects();
    } catch (error) {
      toast.error("Failed to create project.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> New Project
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">New Project</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input className="w-full p-2 border rounded" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              <textarea className="w-full p-2 border rounded" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <button className="w-full bg-blue-600 text-white py-2 rounded">Create</button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{p.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{p.status}</span>
                <button onClick={() => handleDelete(p.id)} className="text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}