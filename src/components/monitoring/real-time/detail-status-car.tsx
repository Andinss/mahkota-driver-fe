"use client";
import { useState } from "react";

interface DetailStatusCardProps {
  onClose?: () => void;
}

const DetailStatusCard = ({ onClose }: DetailStatusCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-4 right-4 bottom-auto w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-30 flex flex-col overflow-hidden">
      <div className="relative h-36 bg-slate-200 dark:bg-slate-700">
        <div
          className="absolute inset-0 bg-cover bg-center"
          data-alt="Vehicle photo for B 1234 KKY"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAE1ma1HuIqhziMDl5-boBMzO_s86g4Xqdmeqf42oUQGgibCUSbwRPKdyV9EEkyx_xzCa-K0UaAUwPpvow0wPpq52zxW77Qgm44-lnmc_UZONyLZtIYxSj_jvV1FceVMT_cl-2lMOoOcEBdY-dPuDRfxzSArSSkpJdkPqvvF2Cgy_6nI0eGu71kz264wpd6W3hR2YuMTRlaYCJo0okPstoCKftcxRjGBlycro5i39WuNaKlFNYD90kJSflAKAS5SNCAhK3yeUNcZNw9")',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <button
            onClick={handleClose}
            className="size-8 bg-black/40 text-white hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="absolute bottom-3 left-4 text-white w-full pr-8">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold">B 1234 KKY</h3>
            <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border border-red-400">
              Emergency
            </span>
          </div>
          <p className="text-xs opacity-90 font-medium">
            Updated: <span className="text-green-400">Just now</span>
          </p>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="size-11 rounded-full bg-slate-100 dark:bg-slate-600 bg-cover bg-center ring-2 ring-white dark:ring-slate-700 shadow-sm"
            data-alt="Driver Budi Santoso Avatar"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_2aHU3kAo-K9_5k_3pymhquhqw_vpD457mf4Xo7b2IIIDzEHutSC0zW-ftTtd0Ex-EZ4tKuViedpSIxBMyEyhuf8kvRv9ValMkECP9E0CXFwfVrPrUz49rGwK917jxY_9ypGp9R6w2HGTI-wtyk5ZfoYOrmUU6b6CLzmAnU0sZdcrTgCPUCkplvmKpubfI_poYQ2OVJaogs6z67BW-rM6eR8ZwdGuN5nhUungbsNNlAP_bwnuc24G7MmvaNb-qrs2banlKes45KKj")',
            }}
          ></div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Budi Santoso
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              +62 812 3456 7890
            </p>
          </div>
          <button className="ml-auto size-9 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors ring-1 ring-green-100 dark:ring-green-900/30">
            <span className="material-symbols-outlined text-xl">call</span>
          </button>
        </div>
        <div className="h-px bg-slate-100 dark:bg-slate-700"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1">
              Speed
            </p>
            <p className="text-sm font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-slate-400 text-base">
                speed
              </span>
              0 km/h
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1">
              Fuel
            </p>
            <p className="text-sm font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-slate-400 text-base">
                local_gas_station
              </span>
              45%
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Current Location
            </p>
            <p className="text-sm font-medium leading-snug text-slate-800 dark:text-slate-200">
              Jl. Jend. Sudirman No. 12, Jakarta Pusat, DKI Jakarta
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 animate-pulse-slow">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-red-500 mt-0.5 text-lg">
              warning
            </span>
            <div>
              <p className="text-xs font-bold text-red-700 dark:text-red-400">
                Geofence Violation Alert
              </p>
              <p className="text-[11px] text-red-600 dark:text-red-300/80 leading-relaxed mt-1">
                Vehicle has exited the designated "Central Zone" without
                authorization.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors">
            History
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors shadow-lg shadow-blue-500/30">
            Dispatch
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailStatusCard;
