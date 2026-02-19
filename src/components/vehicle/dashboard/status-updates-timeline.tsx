interface TimelineItem {
  id: string;
  color: string;
  message: string;
  time: string;
  officer: string;
}

const timelineItems: TimelineItem[] = [
  {
    id: "1",
    color: "bg-blue-500",
    message: "B 1234 XYZ moved to Rented",
    time: "10 mins ago",
    officer: "Officer Ahmad",
  },
  {
    id: "2",
    color: "bg-orange-500",
    message: "B 5678 ABC moved to Maintenance",
    time: "45 mins ago",
    officer: "Officer Siti",
  },
  {
    id: "3",
    color: "bg-green-500",
    message: "B 9012 DEF moved to Available",
    time: "2 hours ago",
    officer: "Officer Budi",
  },
  {
    id: "4",
    color: "bg-purple-500",
    message: "B 3456 GHI moved to Retrieved",
    time: "3 hours ago",
    officer: "Officer Diana",
  },
];

export function StatusUpdatesTimeline() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden h-full shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-bold text-lg dark:text-white">
          Last Status Updates
        </h3>
        <span className="material-symbols-outlined text-gray-400 cursor-pointer">
          refresh
        </span>
      </div>
      <div className="p-6">
        <div className="space-y-8 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800"></div>
          {timelineItems.map((item) => (
            <div key={item.id} className="relative flex gap-4">
              <div className={`relative z-10 w-6 h-6 rounded-full ${item.color} border-4 border-white dark:border-gray-900`}></div>
              <div className="flex-1">
                <p className="text-sm font-semibold dark:text-white">
                  {item.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.time}
                  </span>
                  <span className="text-xs text-primary font-medium">
                    • {item.officer}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
