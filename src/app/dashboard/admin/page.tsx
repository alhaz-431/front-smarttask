"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { Users, LayoutGrid, Activity, Trash2, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ডিলিট লজিক
  const handleDelete = async (userId: string) => {
    if (confirm("আপনি কি নিশ্চিত এই ইউজারকে ডিলিট করতে চান?")) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
        toast.success("ইউজার ডিলিট হয়েছে");
      } catch (error) {
        toast.error("ডিলিট করতে ব্যর্থ হয়েছে");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, logRes] = await Promise.all([
          api.get('/users'),
          api.get('/activity-logs') 
        ]);
        setUsers(userRes.data);
        setLogs(logRes.data);
      } catch (error) {
        toast.error("ডাটা লোড করতে ব্যর্থ হয়েছে");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">লোড হচ্ছে...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <ShieldCheck className="text-blue-600" /> এডমিন প্যানেল
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="মোট ইউজার" count={users.length} icon={<Users />} />
        <StatCard title="অ্যাক্টিভ প্রজেক্ট" count="12" icon={<LayoutGrid />} />
        <StatCard title="সাম্প্রতিক লগ" count={logs.length} icon={<Activity />} />
      </div>

      {/* User Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">ইউজার ম্যানেজমেন্ট</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">নাম</th>
              <th className="p-2">ইমেইল</th>
              <th className="p-2">রোল</th>
              <th className="p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </td>
                <td className="p-2">
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// স্ট্যাট কার্ড কম্পোনেন্ট
const StatCard = ({ title, count, icon }: any) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
    <div className="p-3 bg-blue-100 rounded-full text-blue-600">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{count}</h3>
    </div>
  </div>
);

export default AdminDashboard;