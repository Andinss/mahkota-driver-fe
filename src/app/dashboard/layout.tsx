import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <Topbar />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
