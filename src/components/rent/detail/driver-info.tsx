interface DriverInfoProps {
  name?: string;
  contact?: string;
  email?: string;
  avatar?: string;
}

const DriverInfo = ({
  name = "-",
  contact = "-",
  email = "-",
  avatar,
}: DriverInfoProps) => {
  const imgSrc = avatar || undefined;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-slate-400 text-lg">person</span>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Driver
        </p>
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/15 flex items-center justify-center overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 shrink-0">
          {imgSrc ? (
            <img
              alt={name}
              className="w-full h-full object-cover"
              src={imgSrc}
            />
          ) : (
            <span className="text-lg font-bold text-primary">
              {initials || "?"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
            {name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Driver ID
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">
              call
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Telepon
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {contact}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">
              mail
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Email
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
