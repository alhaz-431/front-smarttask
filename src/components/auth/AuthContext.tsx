"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // সার্ভার সাইডে এরর এড়াতে নিরাপদ রিটার্ন
  if (!context) return { user: null, setUser: () => {} };
  return context;
};