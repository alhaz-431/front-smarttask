"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now(),
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
    toast.success("টাস্ক যোগ করা হয়েছে!");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success("টাস্ক ডিলিট করা হয়েছে");
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      
      {/* টাস্ক ইনপুট */}
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

      {/* টাস্ক লিস্ট */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center py-10">কোনো টাস্ক নেই!</p>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-4 bg-white rounded-xl border ${task.completed ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id)} className={task.completed ? "text-green-500" : "text-gray-300"}>
                  <CheckCircle2 size={24} />
                </button>
                <span className={task.completed ? "line-through text-gray-500" : "text-gray-800"}>
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
