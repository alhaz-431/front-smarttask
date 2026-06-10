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
  Active: {
    label: "Active",
    class: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    dot: "bg-emerald-500",
  },
  Completed: {
    label: "Completed",
    class: "bg-blue-50 text-blue-600 border border-blue-100",
    dot: "bg-blue-500",
  },
  "On Hold": {
    label: "On Hold",
    class: "bg-yellow-50 text-yellow-600 border border-yellow-100",
    dot: "bg-yellow-400",
  },
};

function isDeadlineSoon(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 1000 * 60 * 60 * 48; // 48 hours
}

function isOverdue(dateStr: string) {
  return new Date(dateStr) < new Date();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
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
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top accent line */}
      <div
        className={`h-1 w-full ${
          overdue ? "bg-red-400" : soon ? "bg-yellow-400" : "bg-blue-400"
        }`}
      />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-base leading-snug truncate">
              {project.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>
          <span
            className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.class}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users size={13} className="text-gray-400" />
            {project.memberCount} members
          </span>
          <span className="flex items-center gap-1">
            <CheckSquare size={13} className="text-gray-400" />
            {project.totalTasks} tasks
          </span>
        </div>

        {/* Progress */}
        <ProgressBar total={project.totalTasks} completed={project.completedTasks} />

        {/* Deadline */}
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            overdue
              ? "text-red-500"
              : soon
              ? "text-yellow-600"
              : "text-gray-400"
          }`}
        >
          {overdue ? (
            <AlertCircle size={13} />
          ) : soon ? (
            <Clock size={13} />
          ) : (
            <Calendar size={13} />
          )}
          {overdue
            ? `Overdue — ${formatDate(project.deadline)}`
            : soon
            ? `Due soon — ${formatDate(project.deadline)}`
            : `Deadline: ${formatDate(project.deadline)}`}
        </div>

        {/* View button */}
        <button
          onClick={onView}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-600 text-sm font-medium py-2.5 rounded-xl border border-gray-100 hover:border-blue-100 transition-all duration-150 group"
        >
          <Eye size={15} />
          View Project
          <ChevronRight
            size={14}
            className="opacity-0 group-hover:opacity-100 -ml-1 transition-opacity"
          />
        </button>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-blue-50 p-5 rounded-2xl mb-4">
        <FolderKanban size={36} className="text-blue-400" />
      </div>
      <p className="text-gray-700 font-semibold text-base">
        {filtered ? "No projects match your search" : "No projects yet"}
      </p>
      <p className="text-gray-400 text-sm mt-1">
        {filtered
          ? "Try a different keyword or filter."
          : "You haven't been added to any project yet."}
      </p>
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
  }, [user, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Member শুধু নিজের assigned projects পাবে
        const res = await api.get("/projects/my-projects");
        setProjects(res.data);
      } catch {
        toast.error("Projects load করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ── Filter & Search ──
  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    All: projects.length,
    Active: projects.filter((p) => p.status === "Active").length,
    Completed: projects.filter((p) => p.status === "Completed").length,
    "On Hold": projects.filter((p) => p.status === "On Hold").length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Projects you've been assigned to
          </p>
        </div>
        <span className="text-sm text-gray-500 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl font-medium">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {(["All", "Active", "Completed", "On Hold"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                statusFilter === s
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  statusFilter === s ? "bg-blue-500 text-white" : "bg-white text-gray-500"
                }`}
              >
                {statusCounts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {filtered.length === 0 ? (
            <EmptyState filtered={search !== "" || statusFilter !== "All"} />
          ) : (
            filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onView={() => router.push(`/dashboard/projects/${p.id}`)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}