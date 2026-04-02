const UploadDocument = () => {
  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
          4
        </span>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
          Contract &amp; Documentation
        </h3>
      </div>
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors bg-slate-50/50 dark:bg-slate-800/30 group cursor-pointer">
        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mb-4 text-4xl">
          cloud_upload
        </span>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Upload Signed Rental Contract
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Drag and drop or click to browse (PDF, JPG up to 10MB)
        </p>
      </div>
    </section>
  );
};
export default UploadDocument;
