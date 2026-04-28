const FinanceSummary = () => {
  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm overflow-hidden relative">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
            Invoice Code
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl lg:text-4xl font-black tracking-tighter text-gray-900">
              Invoice #TXN-99284-XYZ
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end mt-10">
          <p className="text-[10px] text-gray-500 mt-3 font-medium">
            24, 2023 • 14:32 PM
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-t border-gray-200 mb-10">
        <div className="mt-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
            Payment Summary
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-gray-500">$</span>
            <span className="text-5xl lg:text-7xl font-black tracking-tighter text-gray-900">
              1,240.00
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end mt-5">
          <span className="px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-full text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Paid
          </span>
          <p className="text-[10px] text-gray-500 mt-3 font-medium">
            Verified by Banking Gateway
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Payment Method
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
              <span
                className="material-symbols-outlined text-blue-600 text-xl"
                data-icon="account_balance_wallet"
              >
                account_balance_wallet
              </span>
            </div>
            <span className="font-bold text-gray-900">Transfer</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Transaction ID
          </p>
          <p className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded w-fit border border-gray-200">
            99284-B-2023
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Reference Code
          </p>
          <p className="font-mono text-sm font-medium text-gray-900">
            XYZ-RE-449
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Duration Contract
          </p>
          <p className="text-sm font-medium text-gray-900">
            3 Days (Oct 24 - Oct 27)
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Location
          </p>
          <p className="text-sm font-medium text-gray-900">Jakarta HQ Branch</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Tax ID
          </p>
          <p className=" text-sm font-medium text-gray-900">
            NPWP 01.234.567.8-901.000
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinanceSummary;
