const FlowFinance = () => {
  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
      <div className="absolute -top-4 -right-4 text-blue-600/5 pointer-events-none">
        <span className="material-symbols-outlined text-9xl">verified</span>
      </div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-10">
        Verification Flow
      </h3>
      <div className="space-y-8 relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
        <div className="relative flex items-start gap-4">
          <div className="z-10 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-xs"
              style={{ fontVariationSettings: "'wght' 700" }}
            >
              check
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Invoice Generated</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">
              Oct 23, 2023 • 09:00 AM
            </p>
          </div>
        </div>
        <div className="relative flex items-start gap-4">
          <div className="z-10 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-xs"
              style={{ fontVariationSettings: "'wght' 700" }}
            >
              check
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Payment Link Sent</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">
              Oct 23, 2023 • 09:15 AM
            </p>
          </div>
        </div>
        <div className="relative flex items-start gap-4">
          <div className="z-10 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-xs"
              style={{ fontVariationSettings: "'wght' 700" }}
            >
              check
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              Transfer Confirmation
            </p>
            <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">
              Oct 24, 2023 • 14:10 PM
            </p>
          </div>
        </div>
        <div className="relative flex items-start gap-4">
          <div className="z-10 w-6 h-6 rounded-full bg-gray-100 border-2 border-blue-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Ledger Reconciled</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">
              Oct 24, 2023 • 14:32 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FlowFinance;
