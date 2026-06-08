import Link from 'next/link';
import { ArrowRight, CheckCircle2, Layout, Zap, Users, BarChart3, Clock, ShieldCheck, FileText } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const features = [
    { icon: <Layout />, title: "ইন্টুইটিভ ড্যাশবোর্ড", desc: "সবকিছু এক নজরে দেখার জন্য আধুনিক ও ক্লিন ড্যাশবোর্ড।" },
    { icon: <CheckCircle2 />, title: "টাস্ক ট্র্যাকিং", desc: "কাজের অগ্রগতি সহজেই ট্র্যাক করুন এবং ডেডলাইন বজায় রাখুন।" },
    { icon: <Users />, title: "টিম কোলাবরেশন", desc: "টিম মেম্বারদের সাথে রিয়েল-টাইমে ফাইল শেয়ার ও মন্তব্য করুন।" },
    { icon: <BarChart3 />, title: "প্রোগ্রেস রিপোর্টিং", desc: "কাস্টম চার্ট ও রিপোর্টের মাধ্যমে কাজের অগ্রগতি দেখুন।" },
    { icon: <Clock />, title: "স্মার্ট শিডিউলিং", desc: "গ্যান্ট চার্ট ও ক্যালেন্ডার ব্যবহার করে সময় পরিকল্পনা করুন।" },
    { icon: <ShieldCheck />, title: "নিরাপদ ডাটা", desc: "আপনার সব প্রজেক্ট ডাটা থাকে সর্বোচ্চ নিরাপত্তায়।" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <Zap size={16} /> নতুন আপডেট: টিম কোলাবরেশন এখন লাইভ!
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Manage Projects, <br />
            <span className="text-blue-600">Boost Productivity.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            আপনার প্রজেক্ট ম্যানেজমেন্ট এবং প্রোডাক্টিভিটি বাড়াতে SmartTask দিচ্ছে সবচেয়ে সহজ ও আধুনিক সমাধান। আজই শুরু করুন আপনার ফ্রি ট্রায়াল।
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Start Your Free Trial <ArrowRight size={20} />
          </Link>
        </div>
        
        {/* Task Management Illustration Placeholder */}
        <div className="relative">
          <img 
            src="https://img.freepik.com/free-vector/project-management-concept-illustration_114360-357.jpg" 
            alt="Task Management" 
            className="w-full h-auto rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">সব ধরণের কাজের জন্য উপযুক্ত ফিচার</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}