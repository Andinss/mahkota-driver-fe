import type { ReactNode } from "react";
export default function LayoutLogin({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <img
          src="/logo.png"
          alt=""
          className="w-[600px] h-[600px] object-contain"
          style={{ transform: "rotate(-15deg) translateX(50%)", opacity: 0.12 }}
        />
      </div>

      <div className="w-full max-w-[420px] px-6 relative z-10">
        {children}
      </div>
    </div>
  );
}
