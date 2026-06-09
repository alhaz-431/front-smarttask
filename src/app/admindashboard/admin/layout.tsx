import Link from 'next/link';
import { LayoutGrid, Users, Briefcase, CheckSquare, Activity, Settings, LogOut, Home, UserCog, BriefcaseBusiness } from 'lucide-react';

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
          
          <SidebarLink href="/admindashboard/admin" icon={<Home size={20} />} label="Dashboard" />
          <SidebarLink href="/admindashboard/admin/users" icon={<Users size={20} />} label="Team Members" />
          <SidebarLink href="/admindashboard/admin/projects" icon={<Briefcase size={20} />} label="All Projects" />
          <SidebarLink href="/admindashboard/admin/tasks" icon={<CheckSquare size={20} />} label="All Tasks" />
          <SidebarLink href="/admindashboard/admin/logs" icon={<Activity size={20} />} label="Activity Logs" />
          <SidebarLink href="/admindashboard/admin/settings" icon={<Settings size={20} />} label="System Settings" />
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
        {/* টপ বার */}
        <header className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Admin Control Panel</h2>
          
          {/* দ্রুত ড্যাশবোর্ড সুইচার বাটনসমূহ */}
          <div className="flex gap-2">
            <Link href="/admindashboard/admin" className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition">
              <Home size={14} /> Admin
            </Link>
            <Link href="/managerdashboard/manager" className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition">
              <UserCog size={14} /> Manager
            </Link>
            <Link href="/dashboard/projects" className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 transition">
              <BriefcaseBusiness size={14} /> Member
            </Link>
          </div>
        </header>

        {/* ডাইনামিক পেজ কন্টেন্ট */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}