export type TabValue = "overview" | "vehicle-history";

interface TabNavigationProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b mb-7 border-slate-200 dark:border-slate-800">
      <div className="flex gap-8">
        <button
          className={`pb-4 px-2 text-sm font-semibold transition-colors ${
            activeTab === "overview"
              ? "text-primary tab-active"
              : "text-slate-500 hover:text-primary"
          }`}
          onClick={() => onTabChange("overview")}
        >
          Overview
        </button>
        <button
          className={`pb-4 px-2 text-sm font-semibold transition-colors ${
            activeTab === "vehicle-history"
              ? "text-primary tab-active"
              : "text-slate-500 hover:text-primary"
          }`}
          onClick={() => onTabChange("vehicle-history")}
        >
          Vehicle history
        </button>
      </div>
    </div>
  );
}
