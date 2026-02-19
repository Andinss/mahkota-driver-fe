import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import StatCard from "@/components/dashboard/card";
import ChartCard from "@/components/dashboard/chart";
import RecentCard from "@/components/dashboard/recentRegister";

const Dashboard = () => {
  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
          <div className="p-7">
            <StatCard />
            <ChartCard />
            <RecentCard />
            <footer className="mt-4 pb-8 text-center mt-5 text-sm text-slate-500 dark:text-slate-400">
              <p>© 2023 PT XYZ Rental System. All rights reserved.</p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
