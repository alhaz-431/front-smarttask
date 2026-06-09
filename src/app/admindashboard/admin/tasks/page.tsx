"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Trash2, Edit2, Loader2, X, Plus } from "lucide-react";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "", // এটি আপনার ব্যাকএন্ডের Field Name এর সাথে মিলিয়ে নিন
    priority: "medium",
    deadline: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
        api.get("/users"),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setMembers(usersRes.data);
    } catch (err: any) {
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tasks", formData);
      toast.success("নতুন টাস্ক তৈরি হয়েছে!");
      setIsModalOpen(false);
      setFormData({ title: "", description: "", projectId: "", assignedTo: "", priority: "medium", deadline: "" });
      fetchInitialData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "টাস্ক তৈরি করা যায়নি");
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("টাস্ক ডিলিট হয়েছে");
      fetchInitialData();
    } catch (err) {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Create New Task
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold">Task Title</th>
                <th className="p-4 text-sm font-semibold">Project</th>
                <th className="p-4 text-sm font-semibold">Assigned To</th>
                <th className="p-4 text-sm font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task: any) => (
                <tr key={task.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{task.title}</td>
                  <td className="p-4 text-sm">{task.project?.name || "N/A"}</td>
                  <td className="p-4 text-sm">{task.assignee?.name || "Unassigned"}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required className="w-full border p-2.5 rounded-lg" placeholder="Task Title" onChange={(e) => setFormData({...formData, title: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <select required className="w-full border p-2.5 rounded-lg" onChange={(e) => setFormData({...formData, projectId: e.target.value})}>
                  <option value="">Select Project</option>
                  {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select className="w-full border p-2.5 rounded-lg" onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}>
                  <option value="">Select Member</option>
                  {members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <input type="date" required className="w-full border p-2.5 rounded-lg" onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
              
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Save Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}