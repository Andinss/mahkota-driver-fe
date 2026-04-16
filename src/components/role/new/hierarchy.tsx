const RoleHierarchy = () => {
  return (
    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
      <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined">info</span>
        Role Hierarchy
      </h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Roles determine the visibility of data. A higher hierarchy role can
        manage users in roles below them.
      </p>
      <div className="p-4 bg-white rounded-lg border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Previewing Permissions
          </span>
        </div>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-xs text-gray-500">
            <span className="material-symbols-outlined text-[16px] text-green-600">
              check_circle
            </span>
            Can create new vehicles
          </li>
          <li className="flex items-center gap-2 text-xs text-gray-500">
            <span className="material-symbols-outlined text-[16px] text-green-600">
              check_circle
            </span>
            Can edit existing staff accounts
          </li>
          <li className="flex items-center gap-2 text-xs text-gray-500">
            <span className="material-symbols-outlined text-[16px] text-red-600">
              cancel
            </span>
            Cannot view tax statements
          </li>
        </ul>
      </div>
    </div>
  );
};
export default RoleHierarchy;
