import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { TrendBadge } from "@/components/ui/trend-badge";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  trend: {
    value: string;
    direction?: "up" | "down" | "neutral";
    color?: string;
  };
}

const StatCard = ({ title, value, icon, iconColor, trend }: StatCardProps) => {
  return (
    <Card className="flex flex-col gap-2 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {title}
        </p>
        <span className={`${iconColor} bg-${iconColor.replace("text-", "")}/10 p-1.5 rounded-md text-[20px]`}>
          <Icon name={icon} />
        </span>
      </div>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">
          {value}
        </p>
        <TrendBadge value={trend.value} direction={trend.direction} color={trend.color} />
      </div>
    </Card>
  );
};

const DashboardCards = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Users"
        value="1,240"
        icon="group"
        iconColor="text-primary"
        trend={{ value: "12%", direction: "up" }}
      />
      <StatCard
        title="Active Users"
        value="980"
        icon="person_check"
        iconColor="text-emerald-500"
        trend={{ value: "5%", direction: "up" }}
      />
      <StatCard
        title="Pending Approvals"
        value="12"
        icon="pending_actions"
        iconColor="text-amber-500"
        trend={{ value: "Requires Action", direction: "neutral" }}
      />
      <StatCard
        title="New Signups Today"
        value="5"
        icon="how_to_reg"
        iconColor="text-primary"
        trend={{ value: "1%", direction: "up" }}
      />
    </section>
  );
};

export default DashboardCards;
