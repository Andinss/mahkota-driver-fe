interface FlowFinanceProps {
  status?: "pending" | "completed" | "verified";
}

const FlowFinance = ({ status = "completed" }: FlowFinanceProps) => {
  const steps = [
    { label: "Invoice Generated", done: true },
    { label: "Payment Recorded", done: status !== "pending" },
    { label: "Amount Verified", done: status === "completed" || status === "verified" },
    { label: "Ledger Reconciled", done: status === "verified" },
  ];

  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
      <div className="absolute -top-4 -right-4 text-blue-600/5 pointer-events-none">
        <span className="material-symbols-outlined text-9xl">verified</span>
      </div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-10">
        Verification Flow
      </h3>
      <div className="space-y-8 relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-start gap-4">
            <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center ${
              step.done
                ? "bg-blue-600"
                : "bg-gray-100 border-2 border-gray-300"
            }`}>
              {step.done ? (
                <span
                  className="material-symbols-outlined text-white text-xs"
                  style={{ fontVariationSettings: "'wght' 700" }}
                >
                  check
                </span>
              ) : (
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              )}
            </div>
            <div>
              <p className={`text-sm font-bold ${step.done ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                {step.label}
              </p>
              <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">
                {step.done ? "Completed" : "Pending"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FlowFinance;
