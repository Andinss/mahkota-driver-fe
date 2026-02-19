import { DetailStatsCard } from "@/components/vehicle/detail/detail-stats-card";
import { DetailSearchBar } from "@/components/vehicle/detail/detail-search-bar";
import { DetailVehicleTable } from "@/components/vehicle/detail/detail-vehicle-table";
import { DetailHistoryPanel } from "@/components/vehicle/detail/detail-history-panel";

const VehicleDetail = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DetailStatsCard title="Available" value={42} percentage="+2%" progress={65} color="blue" />
          <DetailStatsCard title="Rented" value={18} percentage="+5%" progress={25} color="amber" />
          <DetailStatsCard title="Maintenance" value={5} percentage="-1%" progress={10} color="red" />
          <DetailStatsCard title="Retrieved" value={12} percentage="0%" progress={15} color="slate" />
        </div>

        {/* Search Bar */}
        <DetailSearchBar />

        {/* Main Grid: Table & Details */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start h-full">
          {/* Left Column: Vehicle List */}
          <DetailVehicleTable />

          {/* Right Column: Activity/Details Panel */}
          <DetailHistoryPanel />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
