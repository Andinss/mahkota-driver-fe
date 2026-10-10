"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface DriverMenuItem {
  path: string;
  label: string;
  icon: string;
}

const driverMenu: DriverMenuItem[] = [
  { path: "/dashboard/driver", label: "Dashboard", icon: "dashboard" },
  { path: "/dashboard/driver/payment", label: "Payment", icon: "payment" },
  { path: "/dashboard/driver/profile", label: "Profile", icon: "person" },
];

const DriverSidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  /** Overlay mobile (< 768px). Default false di server & client agar tidak hydration mismatch. */
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, height: 0 });
  const menuRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const isOpenRef = useRef(isOpen);
  const navRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(pathname);
  const activeMenuRef = useRef(activeMenu);

  useEffect(() => {
    setActiveMenu(pathname);
  }, [pathname]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    activeMenuRef.current = activeMenu;
  }, [activeMenu]);

  useEffect(() => {
    const handleToggle = () => {
      if (window.innerWidth < 768) {
        setIsMobileOpen((prev) => !prev);
      } else {
        setIsOpen((prev) => !prev);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
        if (!isOpenRef.current) setIsOpen(true);
      }
    };
    window.addEventListener("sidebar:toggle", handleToggle);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("sidebar:toggle", handleToggle);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // tutup overlay mobile dengan Escape
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isMobileOpen]);

  const updateMenuPosition = useCallback(() => {
    const currentActive = activeMenuRef.current;
    const activeElement = menuRefs.current[currentActive];
    if (activeElement) {
      setMenuPosition({
        top: activeElement.offsetTop,
        height: activeElement.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateMenuPosition();
      const timeout = setTimeout(updateMenuPosition, 300);
      return () => clearTimeout(timeout);
    }
  }, [activeMenu, isOpen, updateMenuPosition]);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;
    const handleScroll = () => { if (isOpenRef.current) updateMenuPosition(); };
    const handleResize = () => { if (isOpenRef.current) updateMenuPosition(); };
    navEl.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      navEl.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateMenuPosition]);

  const handleMenuClick = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileOpen(false);
    setActiveMenu(path);
    router.push(path);
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  return (
    <>
      <aside
        className={`flex h-screen flex-col bg-white dark:bg-slate-900 transition-all duration-300 overflow-hidden ${
          isOpen
            ? "md:w-64 md:border-r md:border-slate-200 md:dark:border-slate-800"
            : "md:w-0"
        } max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-64 max-md:shadow-2xl ${
          isMobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        }`}
      >
        <div className="w-64 shrink-0 flex flex-col h-full">
          <div className="flex gap-3 p-6 shrink-0">
            <div
              className="bg-center bg-white dark:bg-[#1a2632] bg-no-repeat bg-cover rounded-full size-10 shrink-0 bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary"
              style={{ backgroundImage: 'url("/logo.png")' }}
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                Mahkota Drive
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
                Driver Portal
              </p>
            </div>
          </div>

          <nav
            ref={navRef}
            className="flex-1 overflow-y-auto flex flex-col gap-1 relative px-3"
          >
            <div
              className="absolute bg-primary/10 rounded-lg transition-all duration-300 ease-in-out pointer-events-none z-0"
              style={{
                top: menuPosition.top,
                height: menuPosition.height,
                left: "6px",
                right: "6px",
              }}
            />

            {driverMenu.map((item) => (
              <a
                key={item.path}
                ref={(el) => { menuRefs.current[item.path] = el; }}
                className={`flex items-center rounded-lg relative z-10 transition-colors cursor-pointer gap-3 px-3 py-2.5 ${
                  activeMenu === item.path
                    ? "text-primary"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                onClick={(e) => handleMenuClick(item.path, e)}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="text-sm font-medium leading-normal">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-1 shrink-0 border-t border-slate-200 dark:border-slate-800 px-2 py-2">
            <a
              className="flex items-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer gap-3 px-3 py-2.5"
              onClick={handleLogout}
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <p className="text-sm font-medium leading-normal">Logout</p>
            </a>
          </div>
        </div>
      </aside>

      {/* Backdrop mobile: konten di belakang tidak ikut bergeser */}
      <div
        aria-hidden
        onClick={() => setIsMobileOpen(false)}
        className={`max-md:fixed max-md:inset-0 max-md:z-40 max-md:bg-black/50 max-md:transition-opacity max-md:duration-300 md:hidden ${
          isMobileOpen
            ? "max-md:opacity-100"
            : "max-md:opacity-0 max-md:pointer-events-none"
        }`}
      />
    </>
  );
};

export default DriverSidebar;
