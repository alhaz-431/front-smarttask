"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Trash2, Edit2, UserPlus, Loader2, X } from "lucide-react";

export default function TeamMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: "", email: "", role: "member" });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/users");
      setMembers(res.data);
    } catch (err: any) {
      toast.error("ডাটা লোড করা যায়নি!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        // এডিট করার জন্য PATCH রিকোয়েস্ট
        await api.patch(`/users/${editingMember.id}`, formData);
        toast.success("মেম্বার সফলভাবে আপডেট হয়েছে");
      } else {
        // নতুন যোগ করার জন্য POST রিকোয়েস্ট
        await api.post("/users", formData);
        toast.success("নতুন মেম্বার যুক্ত হয়েছে");
      }
      setIsModalOpen(false);
      setEditingMember(null);
      setFormData({ name: "", email: "", role: "member" });
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "অপারেশন সফল হয়নি");
    }
  };

  const openEditModal = (member: any) => {
    setEditingMember(member);
    setFormData({ name: member.name, email: member.email, role: member.role });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
        <button 
          onClick={() => { setEditingMember(null); setFormData({ name: "", email: "", role: "member" }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      {/* টেবিল লজিক */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          {/* টেবিল হেডার ও বডি এখানে থাকবে */}
          <tbody>
            {members.map((member: any) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{member.name}</td>
                <td className="p-4">{member.email}</td>
                <td className="p-4">{member.role}</td>
                <td className="p-4 text-right">
                  <button onClick={() => openEditModal(member)} className="text-blue-600 mr-3"><Edit2 size={16} /></button>
                  <button onClick={() => {/* delete logic */}} className="text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* মোডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-lg font-bold">{editingMember ? "Edit Member" : "Add Member"}</h2>
            <input required placeholder="Name" className="w-full border p-2 rounded" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Email" className="w-full border p-2 rounded" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <select className="w-full border p-2 rounded" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full bg-gray-200 py-2 rounded">Cancel</button>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}