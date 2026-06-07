import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <main className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">SmartTask</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Manage your tasks, projects, and productivity efficiently with our smart dashboard.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Get Started
          </Link>
          <Link 
            href="/signup" 
            className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Create Account
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-6 text-gray-400 text-sm">
        © 2026 SmartTask Management System
      </footer>
    </div>
  );
}