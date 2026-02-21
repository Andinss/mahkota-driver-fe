type TabValue = "information" | "rental";

interface TabNavigationProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-[#e5e7eb] px-6">
      <nav className="flex gap-8">
        <button
          onClick={() => onTabChange("information")}
          className={`py-4 border-b-2 font-bold text-sm transition-colors ${
            activeTab === "information"
              ? "border-primary text-primary"
              : "border-transparent text-[#617589] hover:text-[#111418]"
          }`}
        >
          Information
        </button>
        <button
          onClick={() => onTabChange("rental")}
          className={`py-4 border-b-2 font-bold text-sm transition-colors ${
            activeTab === "rental"
              ? "border-primary text-primary"
              : "border-transparent text-[#617589] hover:text-[#111418]"
          }`}
        >
          Rental History
        </button>
      </nav>
    </div>
  );
}
