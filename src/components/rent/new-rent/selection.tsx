const SelectionForm = () => {
  return (
    <div>
      <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-primary/20 dark:border-primary/10 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            1
          </span>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            Driver &amp; Vehicle Selection
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-primary">
              Select Active Driver
            </label>
            <div className="relative flex items-center p-0.5 rounded-lg border-2 border-primary bg-white dark:bg-slate-900 shadow-sm transition-all">
              <div className="flex items-center flex-1 px-3 py-1.5 gap-3">
                <img
                  alt="Driver"
                  className="size-8 rounded-full border border-slate-200 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6R4lGoet6ou7Ghl6BKBWHQGD3c5NTjo6tMOz1TZipyBTpnArSw0n2SNPQM9DouMNsrpxwcX3P28pzh2TVLd4J_0XMTuoEAg5wTb7lmQirCwrE2hPNrhJUvTSFS2GOTstzDIPsAlkYh3G5dqaWha3JAy5iSacHNN_8F4gusnnw6t2-AepUEPpHFC485haagkKxxASoqFFul7MEDSwH-goLr-zrQHm1-WLSFlPUAzpGnkfNIYePZcozEQOQ-TTcc6V9FNc0SgMyzLnh"
                />
                <div className="flex-1 flex flex-col">
                  <span className="material-symbols-outlined absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    search
                  </span>
                  <input
                    className="w-full p-0 border-none bg-transparent focus:ring-0 text-sm font-medium placeholder:text-slate-400"
                    placeholder="Search driver by name or ID..."
                    type="text"
                    value=""
                  />
                </div>
              </div>
              <div className="px-2 border-l border-slate-200 dark:border-slate-700 h-8 flex items-center">
                <span className="material-symbols-outlined text-slate-400">
                  expand_more
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2 group">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-primary">
              Select Available Vehicle
            </label>
            <div className="relative flex items-center p-0.5 rounded-lg border-2 border-primary bg-white dark:bg-slate-900 shadow-sm transition-all">
              <div className="flex items-center flex-1 px-3 py-1.5 gap-3">
                <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <span className="material-symbols-outlined text-slate-500 text-xl">
                    directions_car
                  </span>
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="material-symbols-outlined absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    search
                  </span>
                  <input
                    className="w-full p-0 border-none bg-transparent focus:ring-0 text-sm font-medium placeholder:text-slate-400"
                    placeholder="Search by plate or model..."
                    type="text"
                    value="B 1234 XYZ - Toyota Avanza"
                  />
                </div>
              </div>
              <div className="px-2 border-l border-slate-200 dark:border-slate-700 h-8 flex items-center">
                <span className="material-symbols-outlined text-slate-400">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default SelectionForm;
