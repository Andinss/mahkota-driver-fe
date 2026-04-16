const Permission = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">
            rule_settings
          </span>
          Permissions Configuration
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Define which modules and actions this role can access.
        </p>
      </div>
      <div className="divide-y divide-gray-200">
        <div className="p-6 flex items-center justify-between group hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <span className="material-symbols-outlined">dashboard</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Dashboard View</p>
              <p className="text-xs text-gray-500">
                Access to analytics and real-time status updates.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input defaultChecked className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="p-6 group hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">User Management</p>
                <p className="text-xs text-gray-500">
                  Control access for staff and system operators.
                </p>
              </div>
            </div>
          </div>
          <div className="ml-14 max-w-md">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-white transition-colors bg-white/50">
                <input
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  type="checkbox"
                />
                <span className="text-sm font-medium">Add</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-white transition-colors bg-white/50">
                <input
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  type="checkbox"
                />
                <span className="text-sm font-medium">Edit</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-white transition-colors bg-white/50">
                <input
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  type="checkbox"
                />
                <span className="text-sm font-medium">View/Read</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-white transition-colors bg-white/50">
                <input
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  type="checkbox"
                />
                <span className="text-sm font-medium">Delete</span>
              </label>
            </div>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-blue-300 bg-blue-50 cursor-pointer">
              <input
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                type="checkbox"
              />
              <span className="text-sm font-medium text-blue-700">
                All/Full Access
              </span>
            </label>
          </div>
        </div>

        <div className="p-6 group hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <span className="material-symbols-outlined">
                  directions_car
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Vehicle Management
                </p>
                <p className="text-xs text-gray-500">
                  Manage fleet inventory, maintenance, and tracking.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 ml-14">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-white transition-colors">
              <input
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                name="veh_mgmt"
                type="radio"
              />
              <span className="text-sm font-medium">Read-only</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-blue-300 bg-blue-50 cursor-pointer">
              <input
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                name="veh_mgmt"
                type="radio"
              />
              <span className="text-sm font-medium text-blue-700">
                Full Access
              </span>
            </label>
          </div>
        </div>

        <div className="p-6 group hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                <span className="material-symbols-outlined">event_note</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Rental Operations</p>
                <p className="text-xs text-gray-500">
                  Daily workflow for assignments and returns.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 ml-14">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors border border-transparent">
              <input
                defaultChecked
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                type="checkbox"
              />
              <span className="text-xs font-semibold">Assign</span>
            </label>
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors border border-transparent">
              <input
                defaultChecked
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                type="checkbox"
              />
              <span className="text-xs font-semibold">Retrieval</span>
            </label>
          </div>
        </div>

        <div className="p-6 flex items-center justify-between group hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Financial Reporting</p>
              <p className="text-xs text-gray-500">
                View revenue reports, invoices, and payment logs.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
export default Permission;
