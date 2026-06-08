"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ১. কনটেক্সট তৈরি করা
const AuthContext = createContext<any>(null);

// ২. প্রোভাইডার তৈরি করা
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null); // ইউজারের তথ্য রাখার স্টেট

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ৩. কাস্টম হুক (ব্যবহারের সুবিধার্থে)
export const useAuth = () => useContext(AuthContext);