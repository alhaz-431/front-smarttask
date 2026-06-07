import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* মেইন গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* ব্র্যান্ডিং সেকশন */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4">SmartTask</h2>
            <p className="text-sm leading-relaxed">
              আপনার প্রজেক্ট ম্যানেজমেন্টকে সহজ এবং স্মার্ট করার জন্য আমরা নিয়ে এসেছি আধুনিক টুলস।
            </p>
          </div>

          {/* লিঙ্ক সেকশন */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="hover:text-blue-400">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-400">Pricing</Link></li>
              <li><Link href="/integrations" className="hover:text-blue-400">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-blue-400">Careers</Link></li>
              <li><Link href="/support" className="hover:text-blue-400">Support</Link></li>
            </ul>
          </div>

          {/* নিউজলেটার সেকশন */}
          <div>
            <h3 className="text-white font-semibold mb-4">Subscribe</h3>
            <p className="text-xs mb-4">আমাদের নতুন আপডেটের জন্য সাবস্ক্রাইব করুন।</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-gray-800 text-white p-2 rounded-l-lg w-full outline-none text-sm border-none"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg text-white text-sm hover:bg-blue-700">Join</button>
            </div>
          </div>
        </div>

        {/* বটম সেকশন */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SmartTask Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}