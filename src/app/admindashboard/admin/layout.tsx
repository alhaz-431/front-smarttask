import Link from 'next/link';
import { LayoutGrid, Users, Briefcase, CheckSquare, Activity, Settings, LogOut, Home } from 'lucide-react';

// সাইডবার লিংক কম্পোনেন্ট
const SidebarLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <Link href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-800 transition text-gray-200 hover:text-white">
    {icon} <span>{label}</span>
  </Link>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Navy Blue Theme */}
      <aside className="w-64 bg-[#1a237e] text-white min-h-screen flex flex-col shadow-xl">
        
        {/* লোগো সেকশন */}
        <div className="p-6 text-xl font-bold border-b border-blue-900 flex items-center gap-2">
          <LayoutGrid className="text-blue-400" />
          <span>SmartTask</span>
        </div>
        
        {/* মেনু সেকশন */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider p-3">Admin Menu</div>
          
          <SidebarLink href="/dashboard/admin" icon={<Home size={20} />} label="Dashboard" />
          <SidebarLink href="/dashboard/admin/users" icon={<Users size={20} />} label="Team Members" />
          <SidebarLink href="/dashboard/admin/projects" icon={<Briefcase size={20} />} label="All Projects" />
          <SidebarLink href="/dashboard/admin/tasks" icon={<CheckSquare size={20} />} label="All Tasks" />
          <SidebarLink href="/dashboard/admin/logs" icon={<Activity size={20} />} label="Activity Logs" />
          <SidebarLink href="/dashboard/admin/settings" icon={<Settings size={20} />} label="System Settings" />
        </nav>

        {/* বটম সেকশন - লগআউট */}
        <div className="p-4 border-t border-blue-900">
          <button className="flex items-center gap-3 p-3 w-full text-gray-300 hover:text-white hover:bg-red-900/50 rounded-lg transition">
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* টপ বার (ঐচ্ছিক) */}
        <header className="bg-white shadow-sm p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Admin Control Panel</h2>
        </header>

        {/* ডাইনামিক পেজ কন্টেন্ট */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}