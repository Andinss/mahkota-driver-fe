interface DocumentSignProps {
  documentUrl?: string;
}

const DocumentSign = ({ documentUrl }: DocumentSignProps) => {
  const hasDocument = !!documentUrl;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-slate-400 text-lg">description</span>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Dokumen
        </p>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {/* Contract Document */}
        <div className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              hasDocument
                ? "bg-red-100 dark:bg-red-900/20"
                : "bg-slate-200 dark:bg-slate-700"
            }`}>
              <span className={`material-symbols-outlined text-xl ${
                hasDocument
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}>
                picture_as_pdf
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Kontrak Sewa
              </p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                {hasDocument ? "Tersedia" : "Belum diunggah"}
              </p>
            </div>
          </div>
          {hasDocument ? (
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all"
            >
              <span className="material-symbols-outlined text-lg">
                download
              </span>
            </a>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
              <span className="material-symbols-outlined text-lg">
                download
              </span>
            </div>
          )}
        </div>

        {/* Placeholder documents */}
        <div className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 opacity-60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-slate-400">
                checklist
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Checklist Kendaraan
              </p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                Saat Pengambilan
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
            <span className="material-symbols-outlined text-lg">
              download
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSign;
