"use client";

import { usePathname } from "next/navigation";
import { IconButton } from "@/components/ui/icon-button";
import { Avatar } from "@/components/ui/avatar";
import { DropdownNotif } from "@/components/notif";
import { useState, useEffect, useRef } from "react";

// Mapping untuk path segment ke label yang readable
const pathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  vehicle: "Vehicles",
  management: "Management",
  driver: "Drivers",
  detail: "Details",
  history: "History",
  register: "Register",
};

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === segments.length - 1;

    return { label, href, isLast };
  });
}

const Topbar = () => {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("sidebar:toggle"));
  };

  const toggleNotif = () => {
    setIsNotifOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };

    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotifOpen]);

  return (
    <header className="h-16 flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0 z-10">
      <button
        onClick={handleToggleSidebar}
        className="md:hidden mr-4 p-2 -ml-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Dynamic Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        {breadcrumbs.length > 0 && (
          <>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-slate-300">/</span>
                {crumb.isLast ? (
                  <span className="text-slate-900 dark:text-white font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <a className="hover:text-primary" href={crumb.href}>
                    {crumb.label}
                  </a>
                )}
              </div>
            ))}
          </>
        )}
      </nav>

      <div className="flex items-center gap-4 ml-auto">
        <button className="sm:hidden p-2 text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </button>
        <div className="relative" ref={notifRef}>
          <div
            onClick={toggleNotif}
            className="cursor-pointer transition-colors"
          >
            <IconButton name="notifications" badge />
            <span className="absolute top-2 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          {isNotifOpen && <DropdownNotif />}
        </div>
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              Sarah Jenkins
            </p>
            <p className="text-xs text-slate-500">Supervisor</p>
          </div>
          <Avatar
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBWlskkdFoTQprusiYVu7an4AXhl_9-FDQvUqoV7CfJSu11thcCE5vg56M68qimVlCi6UKLy0TemBcJADCyasSX01GUoGRkbawpjU1ZmAMY-Q3l5L8MipeG8HQfoPZ7oLbMtatSz_6mnssWAwAAQC7qn7FDiraGFp_qcQ2JBGyR0Esxy0mOpcPFgg_qckqazyxa9aCAwYO9nZE9cDtkWMv81L4VX6zliMkx7Y5fj1RwV8KCuCKEGshMHI6DMr3a54zGOa8-eyg_jWH"
            alt="Admin user profile avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
