const ActivityLog = () => {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 shadow-sm">
      <h4 className="text-[0.7rem] font-black text-gray-500 uppercase tracking-[0.25em] mb-8 flex items-center gap-2">
        <span className="w-4 h-px bg-gray-300"></span> Recent Activity Log
      </h4>
      <div className="relative">
        {/* Vertical Timeline Line - positioned exactly at the center of the left column */}
        <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gray-200 rounded-full"></div>

        {/* Log Item 1 - Completed */}
        <div className="relative flex gap-4 pb-8">
          <div className="flex-shrink-0 z-10">
            <div className="w-9 h-9 rounded-full bg-blue-600 shadow-md flex items-center justify-center">
              <span
                className="material-symbols-outlined text-sm text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div>
              <p className="text-sm font-bold text-gray-900">
                Approved Fuel Reimbursement
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Transaction #TX-9902 for Budi Santoso (DR-102)
              </p>
            </div>
            <span className="text-[0.6rem] font-semibold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
              Today, 09:45 AM
            </span>
          </div>
        </div>

        {/* Log Item 2 - Completed */}
        <div className="relative flex gap-4 pb-8">
          <div className="flex-shrink-0 z-10">
            <div className="w-9 h-9 rounded-full bg-blue-600 shadow-md flex items-center justify-center">
              <span
                className="material-symbols-outlined text-sm text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                person_add
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div>
              <p className="text-sm font-bold text-gray-900">
                Assigned New Driver
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Assigned Rahmat Agus (DR-209) to Northern Route
              </p>
            </div>
            <span className="text-[0.6rem] font-semibold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
              Yesterday, 04:20 PM
            </span>
          </div>
        </div>

        {/* Log Item 3 - Completed */}
        <div className="relative flex gap-4 pb-8">
          <div className="flex-shrink-0 z-10">
            <div className="w-9 h-9 rounded-full bg-blue-600 shadow-md flex items-center justify-center">
              <span
                className="material-symbols-outlined text-sm text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                login
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div>
              <p className="text-sm font-bold text-gray-900">System Login</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Accessed from Mobile Device (Jakarta, ID)
              </p>
            </div>
            <span className="text-[0.6rem] font-semibold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
              Oct 24, 08:12 AM
            </span>
          </div>
        </div>

        {/* Log Item 4 - Current/Pending (no checkmark, just outline) */}
        <div className="relative flex gap-4">
          <div className="flex-shrink-0 z-10">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-300 shadow-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-gray-400">
                edit_note
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div>
              <p className="text-sm font-bold text-gray-900">
                Updated Vehicle Allocation
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Changed vehicle for Budi Santoso to B-1234-XYZ
              </p>
            </div>
            <span className="text-[0.6rem] font-semibold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
              Oct 23, 11:30 AM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ActivityLog;
