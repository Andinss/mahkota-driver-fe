interface RoleCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  valueColor?: string;        
  trend?: {                   
    value: string;
    color: string;
    icon: string;
  };
  progressBar?: {             
    percentage: number;
    label: string;
  };
}

export function RoleCard({
  title,
  value,
  icon,
  iconColor,
  valueColor,
  trend,
  progressBar,
}: RoleCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
          <span className={`material-symbols-outlined ${iconColor}`}>
            {icon}
          </span>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{title}</h4>
          <p className={`text-2xl font-black tracking-tighter ${valueColor ?? "text-slate-900"}`}>
            {value}
          </p>
        </div>
      </div>


      {trend && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
          <span>Last 30 Days</span>
          <span className={`flex items-center gap-1 ${trend.color}`}>
            <span className="material-symbols-outlined text-sm">
              {trend.icon}
            </span>
            {trend.value}
          </span>
        </div>
      )}

      {progressBar && (
        <div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${progressBar.percentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
            {progressBar.label}
          </p>
        </div>
      )}

    </div>
  );
}