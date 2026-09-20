import ConditionalSidebar from "@/components/conditional-sidebar";
import Topbar from "@/components/topbar";
import AuthGuard from "@/components/auth-guard";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full">
        <ConditionalSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
