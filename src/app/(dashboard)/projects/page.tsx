"use client";
import dynamic from "next/dynamic";

const ProjectsContent = dynamic(() => import("@/components/auth/ProjectsContent"), {
  ssr: false, 
});

export default function Page() {
  return <ProjectsContent />;
}