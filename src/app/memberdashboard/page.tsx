"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ArrowRight,
  Activity,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
interface Stats {
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

interface Task {
  id: string;
  title: string;
  projectName: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  status: "Todo" | "In Progress" | "Completed";
}

interface ActivityItem {
  id: string;
  message: string;
  time: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const priorityStyles: Record<Task["priority"], string> = {
  High: "bg-red-50 text-red-600 border border-red-100",
  Medium: "bg-yellow-50 text-yellow-600 border border-yellow-100",
  Low: "bg-green-50 text-green-600 border border-green-100",
};

const statusStyles: Record<Task["status"], string> = {
  Todo: "bg-gray-100 text-gray-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
};

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

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`${bg} p-3 rounded-xl`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-800 leading-none mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function MemberDashboard() {
  const [stats, setStats] = useState<Stats>({
    activeProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, tasksRes, activityRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/recent-tasks"),
          api.get("/dashboard/activity"),
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data);
        setActivities(activityRes.data);
      } catch {
        toast.error("Dashboard data load করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

  // completion %
  const total = stats.completedTasks + stats.pendingTasks;
  const completionPct = total > 0 ? Math.round((stats.completedTasks / total) * 100) : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Active Projects"
          value={stats.activeProjects}
          icon={FolderKanban}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          label="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckCircle2}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          label="Pending Tasks"
          value={stats.pendingTasks}
          icon={Clock}
          color="text-yellow-600"
          bg="bg-yellow-50"
        />
        <StatCard
          label="Overdue Tasks"
          value={stats.overdueTasks}
          icon={AlertTriangle}
          color="text-red-500"
          bg="bg-red-50"
        />
      </div>

      {/* ── Progress Bar ── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            <span className="font-semibold text-gray-800 text-sm">
              Overall Task Completion
            </span>
          </div>
          <span className="text-sm font-bold text-blue-600">{completionPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {stats.completedTasks} of {total} tasks completed
        </p>
      </div>

      {/* ── Recent Tasks + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Tasks — takes 2/3 width on large screens */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar size={17} className="text-blue-500" />
              <h2 className="font-semibold text-gray-800 text-sm">My Recent Tasks</h2>
            </div>
            <Link
              href="/dashboard/tasks"
              className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 transition"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-400 text-sm">
              No tasks assigned yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {task.projectName}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-xs font-medium ${
                        isOverdue(task.dueDate) && task.status !== "Completed"
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {formatDate(task.dueDate)}
                    </p>
                    {isOverdue(task.dueDate) && task.status !== "Completed" && (
                      <span className="text-xs text-red-400">Overdue</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Log — takes 1/3 width */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Activity size={17} className="text-blue-500" />
            <h2 className="font-semibold text-gray-800 text-sm">Recent Activity</h2>
          </div>

          {activities.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-400 text-sm">
              No recent activity.
            </div>
          ) : (
            <div className="px-5 py-3 space-y-4">
              {activities.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 leading-snug">
                      {item.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}