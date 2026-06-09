"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { CheckSquare, Trash2, Edit2, Loader2, X, Plus } from "lucide-react";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
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
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tasks", formData);
      toast.success("নতুন টাস্ক তৈরি হয়েছে!");
      setIsModalOpen(false);
      setFormData({ title: "", description: "", projectId: "", assignedTo: "", priority: "medium", deadline: "" });
      fetchInitialData(); // রিফ্রেশ লিস্ট
    } catch (err: any) {
      toast.error(err.response?.data?.message || "টাস্ক তৈরি করা যায়নি");
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("টাস্ক ডিলিট হয়েছে");
      fetchInitialData();
    } catch (err) {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
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
                <th className="p-4 text-sm font-semibold">Priority</th>
                <th className="p-4 text-sm font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task: any) => (
                <tr key={task.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{task.title}</td>
                  <td className="p-4 text-gray-600 text-sm">{task.projectId?.name || "N/A"}</td>
                  <td className="p-4 text-gray-600 text-sm">{task.assignedTo?.name || "Unassigned"}</td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase px-2 py-1 rounded font-bold ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-500 hover:bg-blue-50 p-2 rounded mr-1"><Edit2 size={16} /></button>
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- CREATE TASK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Create New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Task Title</label>
                <input 
                  required type="text" placeholder="e.g. Design Homepage"
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Project</label>
                  <select 
                    required className="w-full border rounded-lg p-2.5 outline-none"
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">Select Project</option>
                    {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Assign To</label>
                  <select 
                    className="w-full border rounded-lg p-2.5 outline-none"
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  >
                    <option value="">Select Member</option>
                    {members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Priority</label>
                  <select 
                    className="w-full border rounded-lg p-2.5 outline-none"
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Deadline</label>
                  <input 
                    required type="date" 
                    className="w-full border rounded-lg p-2.5 outline-none"
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mt-4">
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}