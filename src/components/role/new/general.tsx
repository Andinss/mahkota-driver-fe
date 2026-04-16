const GeneralInformation = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-600">badge</span>
        General Information
      </h2>
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1.5"
            htmlFor="role-name"
          >
            Role Name
          </label>
          <input
            className="w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2.5 px-4 text-sm transition-all"
            id="role-name"
            placeholder="e.g. Senior Supervisor"
            type="text"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1.5"
            htmlFor="role-desc"
          >
            Description (Optional)
          </label>
          <textarea
            className="w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2.5 px-4 text-sm transition-all"
            id="role-desc"
            placeholder="Briefly describe the responsibilities of this role..."
            rows={3}
          ></textarea>
        </div>
      </div>
    </div>
  );
};
export default GeneralInformation;
