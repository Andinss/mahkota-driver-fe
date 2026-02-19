interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionHeader = ({ title, description, action }: SectionHeaderProps) => {
  return (
    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 justify-between items-center">
      <div>
        <h3 className="text-slate-900 dark:text-white text-lg font-bold">{title}</h3>
        {description && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
