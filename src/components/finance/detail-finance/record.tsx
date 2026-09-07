import { useRouter } from "next/navigation";

const RecordCard = () => {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
      <div className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-500">
        <span className="material-symbols-outlined text-[10rem]">lock</span>
      </div>
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-xl">security</span>
        </div>
        <h4 className="text-lg font-bold mb-2">Rekaman Tidak Berubah</h4>
        <p className="text-white/80 text-sm leading-relaxed mb-6">
          Transaksi ini ditandatangani secara digital dan terkunci dalam sistem manajemen kendaraan untuk kepatuhan.
        </p>
        <button
          onClick={() => router.push("/dashboard/audit-logs")}
          className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
        >
          Lihat Log Audit
        </button>
      </div>
    </div>
  );
};

export default RecordCard;
