import type { ReactNode } from "react";
export default function LayoutLogin({ children }: { children: ReactNode }) {
  return (
    <main className="flex-grow flex items-center justify-center p-10 sm:p-12">
      <div className="w-full max-w-[480px] flex flex-col gap-8">{children}</div>
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] border-[40px] border-primary rounded-full"></div>
        <div className="absolute bottom-20 right-[20%] w-[300px] h-[300px] border-[20px] border-primary-container rounded-full"></div>
      </div>
    </main>
  );
}
