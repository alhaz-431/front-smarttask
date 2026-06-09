
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader2, Terminal, User, Clock, AlertCircle } from "lucide-react";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/activity-logs"); // নিশ্চিত করুন আপনার ব্যাকএন্ডে এই রুটটি আছে
      setLogs(res.data);
    } catch (err: any) {
      toast.error("লগ ডাটা লোড করা যায়নি!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">System Activity Logs</h1>
        <p className="text-gray-500">সিস্টেমের সকল গুরুত্বপূর্ণ অ্যাক্টিভিটির ইতিহাস</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Action</th>
                <th className="p-4 font-semibold text-gray-600">User</th>
                <th className="p-4 font-semibold text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <Terminal size={16} className="text-blue-500" />
                      <span className="text-gray-700 font-medium">{log.action}</span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <User size={16} /> {log.user?.name || "System"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} /> {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-gray-500">
                    <AlertCircle className="mx-auto mb-2 text-gray-400" />
                    কোনো লগ ডাটা পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}