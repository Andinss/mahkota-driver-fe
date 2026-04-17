"use client";

interface CardDriverProps {
  id: string;
  name: string;
  imageUrl: string;
  amount: string;
  time: string;
  status: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CardDriver({
  id,
  name,
  imageUrl,
  amount,
  time,
  status,
  isSelected = false,
  onClick,
}: CardDriverProps) {
  return (
    <div
      className={`cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-900 transition-all shadow-sm ${
        isSelected
          ? "border-2 border-primary shadow-md"
          : "border border-slate-200 dark:border-slate-800 hover:border-primary/50"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img
            alt={name}
            className="size-10 rounded-full object-cover"
            src={imageUrl}
          />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h3>
            <p className="text-[11px] text-slate-500">ID: {id}</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wide">
          {status}
        </span>
      </div>
      <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-3"></div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[11px] text-slate-500 mb-0.5">Late Amount</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{amount}</p>
        </div>
        <span className="text-[11px] text-slate-400">{time}</span>
      </div>
    </div>
  );
}

export default CardDriver;