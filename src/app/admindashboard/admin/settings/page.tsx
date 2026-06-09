"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Save, Shield, Bell, UserCog, Database } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    systemName: "SmartTask",
    allowRegistration: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    toast.success("সেটিংস সফলভাবে আপডেট করা হয়েছে!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        <p className="text-gray-500">সিস্টেম কনফিগারেশন এবং অ্যাডমিন কন্ট্রোল প্যানেল</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><UserCog size={20} /></div>
            <h2 className="text-lg font-bold">General Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">System Name</label>
              <input 
                type="text" 
                className="w-full border p-2.5 rounded-lg"
                value={settings.systemName}
                onChange={(e) => setSettings({...settings, systemName: e.target.value})}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Allow New Registrations</span>
              <input type="checkbox" checked={settings.allowRegistration} onChange={() => setSettings({...settings, allowRegistration: !settings.allowRegistration})} />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-2 rounded-lg text-red-600"><Shield size={20} /></div>
            <h2 className="text-lg font-bold">Security & Maintenance</h2>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Enable Maintenance Mode</span>
            <input type="checkbox" checked={settings.maintenanceMode} onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          <Save size={20} /> Save Changes
        </button>
      </div>
    </div>
  );
}