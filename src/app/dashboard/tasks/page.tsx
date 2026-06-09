"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

interface Task {
  id: string;
  title: string;
  status: "TODO" | "COMPLETED";
}

export default function TasksPage({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks/project/${projectId}`);
        setTasks(res.data);
      } catch (error) {
        toast.error("টাস্ক লোড করতে সমস্যা হয়েছে");
      }
    };
    fetchTasks();
  }, [projectId]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await api.post("/tasks", { title: newTask, projectId });
      setTasks([...tasks, res.data]);
      setNewTask("");
      toast.success("টাস্ক যোগ করা হয়েছে!");
    } catch (error) {
      toast.error("টাস্ক তৈরি করতে সমস্যা হয়েছে");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success("টাস্ক ডিলিট করা হয়েছে");
    } catch (error) {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    } catch (error) {
      toast.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      
      <div className="flex gap-2 mb-8">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="নতুন টাস্ক লিখুন..."
          className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add
        </button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center py-10">কোনো টাস্ক নেই!</p>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-4 bg-white rounded-xl border ${task.status === "COMPLETED" ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task)} className={task.status === "COMPLETED" ? "text-green-500" : "text-gray-300"}>
                  <CheckCircle2 size={24} />
                </button>
                <span className={task.status === "COMPLETED" ? "line-through text-gray-500" : "text-gray-800"}>
                  {task.title}
                </span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}