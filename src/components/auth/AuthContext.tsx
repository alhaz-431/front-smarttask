"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // সার্ভারে localStorage অ্যাক্সেস করার আগে নিশ্চিত হোন আমরা ব্রাউজারে আছি
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse user data");
        }
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData: any) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logoutUser = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: loginUser, logoutUser, loading }}>
      {/* লোডিং অবস্থায় থাকলে অ্যাপের কন্টেন্ট লুকানো থাকবে */}
      {!loading ? children : <div className="min-h-screen flex items-center justify-center">Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    
    return { user: null, setUser: () => {}, logoutUser: () => {}, loading: false };
  }
  return context;
};