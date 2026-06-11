"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Eye,
  FolderKanban,
  Users,
  CheckSquare,
  Calendar,
  Search,
  ChevronRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

// ── Types ──────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "Active" | "Completed" | "On Hold";
  memberCount: number;
  totalTasks: number;
  completedTasks: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const statusConfig = {
  Active: { label: "Active", class: "bg-emerald-50 text-emerald-600 border border-emerald-100", dot: "bg-emerald-500" },
  Completed: { label: "Completed", class: "bg-blue-50 text-blue-600 border border-blue-100", dot: "bg-blue-500" },
  "On Hold": { label: "On Hold", class: "bg-yellow-50 text-yellow-600 border border-yellow-100", dot: "bg-yellow-400" },
};

function isDeadlineSoon(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 1000 * 60 * 60 * 48;
}

function isOverdue(dateStr: string) {
  return new Date(dateStr) < new Date();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Progress Bar ───────────────────────────────────────────────────────────
function ProgressBar({ total, completed }: { total: number; completed: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{completed}/{total} tasks</span>
        <span className="font-medium text-gray-600">{pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Project Card ───────────────────────────────────────────────────────────
function ProjectCard({ project, onView }: { project: Project; onView: () => void }) {
  const status = statusConfig[project.status];
  const overdue = isOverdue(project.deadline) && project.status !== "Completed";
  const soon = isDeadlineSoon(project.deadline);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
      <div className={`h-1 w-full ${overdue ? "bg-red-400" : soon ? "bg-yellow-400" : "bg-blue-400"}`} />
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
          </div>
          <span className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.class}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} /> {status.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Users size={13} /> {project.memberCount} members</span>
          <span className="flex items-center gap-1"><CheckSquare size={13} /> {project.totalTasks} tasks</span>
        </div>
        <ProgressBar total={project.totalTasks} completed={project.completedTasks} />
        <div className={`flex items-center gap-1.5 text-xs font-medium ${overdue ? "text-red-500" : soon ? "text-yellow-600" : "text-gray-400"}`}>
          {overdue ? <AlertCircle size={13} /> : soon ? <Clock size={13} /> : <Calendar size={13} />}
          {overdue ? `Overdue — ${formatDate(project.deadline)}` : soon ? `Due soon — ${formatDate(project.deadline)}` : `Deadline: ${formatDate(project.deadline)}`}
        </div>
        <button onClick={onView} className="mt-auto w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50 text-gray-600 text-sm font-medium py-2.5 rounded-xl transition-all">
          <Eye size={15} /> View Project
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MemberProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Project["status"]>("All");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/login");
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects/my-projects");
        setProjects(res.data);
      } catch { toast.error("Projects load করতে সমস্যা হয়েছে"); } finally { setLoading(false); }
    };
    fetchProjects();
  }, [user, router]);

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border">{projects.length} projects</span>
      </div>

      <div className="bg-white rounded-2xl border p-4 flex gap-3">
        <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-4 py-2 border rounded-xl" />
        <div className="flex gap-1.5">
          {(["All", "Active", "Completed", "On Hold"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 text-xs font-medium rounded-xl ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onView={() => router.push(`/memberdashboard/projects/${p.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}