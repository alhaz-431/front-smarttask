"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import {
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  FolderKanban,
  Tag,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

// ── Types ──────────────────────────────────────────────────────────────
interface Task {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "In Progress" | "Completed";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  projectName: string;
}

// ── Config ─────────────────────────────────────────────────────────────
const STATUS_FLOW: Record<Task["status"], Task["status"]> = {
  Todo: "In Progress",
  "In Progress": "Completed",
  Completed: "Todo",
};

const STATUS_CONFIG: Record<Task["status"], { label: string; icon: React.ElementType; class: string; iconClass: string }> = {
  Todo: { label: "Todo", icon: Circle, class: "bg-gray-100 text-gray-600", iconClass: "text-gray-400" },
  "In Progress": { label: "In Progress", icon: Clock, class: "bg-blue-50 text-blue-600", iconClass: "text-blue-500" },
  Completed: { label: "Completed", icon: CheckCircle2, class: "bg-emerald-50 text-emerald-600", iconClass: "text-emerald-500" },
};

const PRIORITY_CONFIG: Record<Task["priority"], { class: string; dot: string }> = {
  High: { class: "bg-red-50 text-red-600 border border-red-100", dot: "bg-red-500" },
  Medium: { class: "bg-yellow-50 text-yellow-600 border border-yellow-100", dot: "bg-yellow-400" },
  Low: { class: "bg-green-50 text-green-600 border border-green-100", dot: "bg-green-500" },
};

// ── Helper Functions ──────────────────────────────────────────────────
function isOverdue(dateStr: string, status: Task["status"]) {
  return status !== "Completed" && new Date(dateStr) < new Date();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Sub-Components ────────────────────────────────────────────────────
function StatusButton({ task, onUpdate, loading }: { task: Task; onUpdate: (id: string, next: Task["status"]) => void; loading: boolean }) {
  const config = STATUS_CONFIG[task.status];
  const Icon = config.icon;
  const next = STATUS_FLOW[task.status];
  return (
    <button onClick={() => onUpdate(task.id, next)} disabled={loading} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 ${config.class}`}>
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Icon size={13} className={config.iconClass} />}
      {config.label} <ChevronDown size={11} className="opacity-60" />
    </button>
  );
}

function TaskCard({ task, onStatusUpdate, updatingId }: { task: Task; onStatusUpdate: (id: string, next: Task["status"]) => void; updatingId: string | null }) {
  const priority = PRIORITY_CONFIG[task.priority];
  const overdue = isOverdue(task.dueDate, task.status);
  return (
    <div className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 ${task.status === "Completed" ? "opacity-70" : ""} ${overdue ? "border-red-100" : "border-gray-100"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`font-semibold text-gray-900 ${task.status === "Completed" ? "line-through text-gray-400" : ""}`}>{task.title}</p>
          {task.description && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{task.description}</p>}
        </div>
        <span className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${priority.class}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} /> {task.priority}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1"><FolderKanban size={12} /> {task.projectName}</span>
        <span className={`flex items-center gap-1 ${overdue ? "text-red-500" : ""}`}>
          {overdue ? <AlertCircle size={12} /> : <Calendar size={12} />} {overdue ? "Overdue" : "Due"}: {formatDate(task.dueDate)}
        </span>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <span className="text-xs text-gray-400 flex items-center gap-1"><Tag size={11} /> Update status</span>
        <StatusButton task={task} onUpdate={onStatusUpdate} loading={updatingId === task.id} />
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────
export default function MemberTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Task["status"]>("All");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks/my-tasks"); 
        setTasks(res.data);
      } catch { toast.error("Tasks load করতে সমস্যা হয়েছে"); } finally { setLoading(false); }
    };
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (id: string, next: Task["status"]) => {
    setUpdatingId(id);
    
    // স্ট্যাটাস ম্যাপিং (ব্যাকএন্ড Enum এর সাথে সামঞ্জস্যতা নিশ্চিত করতে)
    const statusMap: Record<string, string> = {
      "Todo": "TODO",
      "In Progress": "IN_PROGRESS",
      "Completed": "COMPLETED"
    };

    try {
      await api.patch(`/tasks/${id}/status`, { status: statusMap[next] || next });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: next } : t)));
      toast.success(`Marked as ${next}`);
    } catch { toast.error("Status update ব্যর্থ হয়েছে"); } finally { setUpdatingId(null); }
  };

  const filtered = tasks.filter((t) => 
    t.title.toLowerCase().includes(search.toLowerCase()) && 
    (statusFilter === "All" || t.status === statusFilter)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold">My Tasks</h1></div>
      
      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border p-4 shadow-sm">
        <input 
            placeholder="Search tasks..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
        />
        <div className="flex gap-2 mt-3">
          {(["All", "Todo", "In Progress", "Completed"] as const).map((s) => (
             <button 
                key={s} 
                onClick={() => setStatusFilter(s)} 
                className={`text-xs px-3 py-1 rounded-lg transition ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
             >
               {s}
             </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map((task) => <TaskCard key={task.id} task={task} onStatusUpdate={handleStatusUpdate} updatingId={updatingId} />)
          ) : (
            <p className="col-span-full text-center text-gray-400 py-10">No tasks found.</p>
          )}
        </div>
      )}
    </div>
  );
}