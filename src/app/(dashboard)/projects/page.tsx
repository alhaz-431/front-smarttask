"use client";
import dynamic from "next/dynamic";

// ইমপোর্ট পাথটি আপেক্ষিক (Relative) করে দেখুন
const ProjectsContent = dynamic(() => import("../../../components/auth/ProjectsContent"), {
  ssr: false, 
});

export default function Page() {
  return <ProjectsContent />;
}