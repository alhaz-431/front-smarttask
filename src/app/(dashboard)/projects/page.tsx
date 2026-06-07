"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader2, Plus } from "lucide-react"; // বাড়তি আইকন যোগ করলাম

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string; // ব্যাকএন্ড থেকে আসা ফিল্ড অনুযায়ী আপডেট করে নেবে
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // টোকেন রিট্রিভ করছি
        const token = localStorage.getItem("token");
        
        // হেডারসহ রিকোয়েস্ট পাঠাচ্ছি
        const response = await api.get("/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setProjects(response.data);
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={20} /> New Project
        </button>
      </div>
      
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
                <p className="text-gray-600 mt-2 text-sm">{project.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {project.status || "Active"}
                    </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>No projects found. Create one to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}