import StatCard from "@/components/dashboard/card";
import ChartCard from "@/components/dashboard/chart";
import RecentCard from "@/components/dashboard/recentRegister";

const Dashboard = () => {
  return (
    <>
      <div className="p-7">
        <StatCard />
        <ChartCard />
        <RecentCard />
        <footer className="mt-4 pb-8 text-center mt-5 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2023 PT XYZ Rental System. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
