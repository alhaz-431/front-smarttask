"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

// প্রজেক্টের ডেটা টাইপ ডিফাইন করছি
interface Project {
  _id: string;
  name: string;
  description: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // ব্যাকএন্ড থেকে প্রজেক্ট লিস্ট ফেচ করছি
        const response = await api.get("/projects");
        setProjects(response.data);
      } catch (error) {
        toast.error("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Projects</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="bg-white p-6 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects found. Create one to get started!</p>
          )}
        </div>
      )}
    </div>
  );
}