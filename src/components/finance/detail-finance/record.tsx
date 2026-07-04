import { useRouter } from "next/navigation";

const RecordCard = () => {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
      <div className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-500">
        <span className="material-symbols-outlined text-[10rem]">lock</span>
      </div>
      <div className="relative z-10">
        <span
          className="material-symbols-outlined text-3xl mb-4 block"
        >
          security
        </span>
        <h4 className="text-xl font-bold mb-3">Immutable Record</h4>
        <p className="text-white/80 text-sm leading-relaxed mb-8">
          This transaction is digitally signed and locked within the vehicle
          management ledger for compliance.
        </p>
        <button
          onClick={() => router.push("/dashboard/audit-logs")}
          className="w-full sm:w-auto px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
        >
          View Audit Log
        </button>
      </div>
    </div>
  );
};

export default RecordCard;
