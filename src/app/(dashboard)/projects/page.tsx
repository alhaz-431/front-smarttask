"use client";
import dynamic from "next/dynamic";

// পাথটি নিশ্চিত করুন: components/auth/ProjectsContent
const ProjectsContent = dynamic(() => import("@/components/auth/ProjectsContent"), {
  ssr: false, 
});

export default function Page() {
  return <ProjectsContent />;
}