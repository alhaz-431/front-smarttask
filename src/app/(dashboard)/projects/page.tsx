"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader2, Plus, Trash2, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      toast.error("প্রজেক্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("ডিলিট হয়েছে");
    } catch (error) {
      toast.error("ডিলিট ব্যর্থ হয়েছে");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/projects", formData);
      toast.success("তৈরি হয়েছে!");
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error("তৈরি করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg">New Project</button>
      </div>

      {loading ? <Loader2 className="animate-spin" /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded shadow">
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.description}</p>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 mt-4">Delete</button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={handleCreate} className="bg-white p-6 rounded">
            <input placeholder="Title" onChange={(e) => setFormData({...formData, title: e.target.value})} className="border w-full mb-2 p-2" />
            <input placeholder="Description" onChange={(e) => setFormData({...formData, description: e.target.value})} className="border w-full mb-2 p-2" />
            <button className="bg-blue-600 text-white p-2 w-full">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}