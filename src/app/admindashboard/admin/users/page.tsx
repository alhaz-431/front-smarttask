"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Trash2, Edit2, UserPlus, Loader2 } from "lucide-react";

export default function TeamMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/users");
      setMembers(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "মেম্বারদের ডাটা লোড করা যায়নি!");
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই মেম্বারকে ডিলিট করতে চান?")) return;
    
    try {
      await api.delete(`/users/${id}`);
      toast.success("মেম্বার সফলভাবে ডিলিট হয়েছে");
      fetchMembers(); // লিস্ট রিফ্রেশ করা
    } catch (err: any) {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Team Members Management</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg">
          <UserPlus size={18} /> Add Member
        </button>
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
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member: any) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4 text-gray-600">{member.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                        member.role === 'manager' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 mr-4 transition">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteMember(member.id)} 
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500">কোনো মেম্বার পাওয়া যায়নি।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}