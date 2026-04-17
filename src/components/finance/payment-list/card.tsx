// components/finance/payment-list/card.tsx
interface PaymentCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  trend: {
    icon: string;
    value: string;  // persentase seperti "+12%", "-5%"
    trendColor: string;  // warna untuk persentase
    bgColor: string;  // background color untuk badge
  };
}

export function PaymentCard({
  title,
  value,
  icon,
  iconColor,
  trend,
}: PaymentCardProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-[#dbe0e6] dark:border-gray-700 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="material-symbols-outlined text-4xl text-primary">{icon}</span>
      </div>
      <p className="text-[#617589] dark:text-gray-400 text-sm font-medium leading-normal">
        {title}
      </p>
      <div className="flex items-end gap-2">
        <p className="text-[#111418] dark:text-white text-2xl font-bold leading-tight">
          {value}
        </p>
        <span className={`${trend.trendColor} ${trend.bgColor} px-1.5 py-0.5 rounded text-xs font-semibold`}>
          {trend.value}
        </span>
      </div>
    </div>
  );
}