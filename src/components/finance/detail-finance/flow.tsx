interface FlowFinanceProps {
  status?: "pending" | "completed" | "verified";
}

const FlowFinance = ({ status = "completed" }: FlowFinanceProps) => {
  const steps = [
    { label: "Invoice Dibuat", done: true },
    { label: "Pembayaran Tercatat", done: status !== "pending" },
    { label: "Jumlah Diverifikasi", done: status === "completed" || status === "verified" },
    { label: "Buku Besar Direkonsilasi", done: status === "verified" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-violet-500 text-xl">flow_route</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Alur Verifikasi
          </h3>
          <p className="text-xs text-slate-400">Status proses verifikasi pembayaran</p>
        </div>
      </div>
      <div className="space-y-6 relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-start gap-4">
            <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center ${
              step.done
                ? "bg-blue-600"
                : "bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"
            }`}>
              {step.done ? (
                <span
                  className="material-symbols-outlined text-white text-xs"
                  style={{ fontVariationSettings: "'wght' 700" }}
                >
                  check
                </span>
              ) : (
                <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
              )}
            </div>
            <div>
              <p className={`text-sm font-bold ${step.done ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
                {step.label}
              </p>
              <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                {step.done ? "Selesai" : "Menunggu"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FlowFinance;
