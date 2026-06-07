import Link from 'next/link';
import { ArrowRight, CheckCircle2, Layout, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
          <Zap size={16} /> নতুন আপডেট: টিম কোলাবরেশন এখন লাইভ!
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Manage Tasks <br />
          <span className="text-blue-600">Smartly & Faster</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          আপনার প্রতিদিনের কাজ, প্রজেক্ট এবং ডেডলাইন ম্যানেজ করার সবথেকে সহজ সমাধান। SmartTask এর সাথে প্রোডাক্টিভিটি বাড়ান বহুগুণ।
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Get Started Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            { icon: <Layout className="text-blue-600" />, title: "ইন্টুইটিভ ড্যাশবোর্ড", desc: "সবকিছু এক নজরে দেখার জন্য আধুনিক ড্যাশবোর্ড।" },
            { icon: <CheckCircle2 className="text-blue-600" />, title: "টাস্ক ট্র্যাকিং", desc: "আপনার সব কাজের অগ্রগতি সহজেই ট্র্যাক করুন।" },
            { icon: <Zap className="text-blue-600" />, title: "দ্রুত পারফরম্যান্স", desc: "লাইটেনিং ফাস্ট স্পিড এবং কোনো ল্যাগ ছাড়াই।" },
          ].map((feature, i) => (
            <div key={i} className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}