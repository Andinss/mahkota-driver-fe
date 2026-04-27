const AssignDriver = () => {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 shadow-sm">
      <h4 className="text-[0.7rem] font-black text-gray-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
        <span className="w-4 h-px bg-gray-300"></span> Contact Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold text-gray-500 uppercase">
            Email Address
          </label>
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-sm">
              mail
            </span>
            <span className="font-medium text-sm lg:text-base text-gray-900">
              adrian.s@ptxyz-logistics.com
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold text-gray-500 uppercase">
            Phone Number
          </label>
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-sm">
              call
            </span>
            <span className="font-medium text-sm lg:text-base text-gray-900">
              +62 811 2345 6789
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssignDriver;
