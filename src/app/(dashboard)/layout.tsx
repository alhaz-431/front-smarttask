export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* সাইডবার */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 font-bold text-2xl text-blue-600">SmartTask</div>
        <nav className="mt-6">
          <a href="/dashboard/projects" className="block py-3 px-6 hover:bg-blue-50 text-gray-700">Projects</a>
          <a href="/dashboard/tasks" className="block py-3 px-6 hover:bg-blue-50 text-gray-700">Tasks</a>
        </nav>
      </aside>

      {/* মেইন কন্টেন্ট */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}