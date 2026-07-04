"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  permission: string;
}

const menuItems: MenuItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard", permission: "" },
  { path: "/dashboard/driver", label: "Driver Management", icon: "badge", permission: "driver.read.all" },
  { path: "/dashboard/vehicle", label: "Vehicle Management", icon: "directions_car", permission: "vehicle.read" },
  { path: "/dashboard/rent", label: "Rentals Management", icon: "contract", permission: "rental.read" },
  { path: "/dashboard/users", label: "User Management", icon: "people", permission: "user.read" },
  { path: "/dashboard/role", label: "Roles & Permissions", icon: "shield", permission: "role.read" },
  { path: "/dashboard/finance", label: "Finance Management", icon: "finance", permission: "finance.read" },
  { path: "/dashboard/monitoring", label: "Monitoring", icon: "monitoring", permission: "monitoring.read" },
  { path: "/dashboard/setting", label: "Settings", icon: "settings", permission: "setting.read" },
  { path: "/dashboard/audit-logs", label: "Audit Logs", icon: "receipt_long", permission: "audit.read" },
];

const Sidebar = () => {
  const { user, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [menuPosition, setMenuPosition] = useState({ top: 0, height: 0 });
  const menuRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const isOpenRef = useRef(isOpen);
  const navRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(pathname);
  const activeMenuRef = useRef(activeMenu);

  const hasPermissions = Array.isArray(user?.permissions) && user.permissions.length > 0;

  const filteredMenuItems = isLoading
    ? []
    : menuItems.filter((item) => {
        if (!item.permission || !hasPermissions) return true;
        if (canAccess(user?.permissions, item.permission)) return true;
        if (item.permission === 'driver.read.all' && canAccess(user?.permissions, 'driver.read.own')) return true;
        return false;
      });

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
      setIsOpen((prev) => !prev);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && !isOpenRef.current) {
        setIsOpen(true);
      }
    };

    window.addEventListener("sidebar:toggle", handleToggle);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("sidebar:toggle", handleToggle);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updateMenuPosition = () => {
    const currentActive = activeMenuRef.current;
    const activeElement = menuRefs.current[currentActive];
    if (activeElement) {
      setMenuPosition({
        top: activeElement.offsetTop,
        height: activeElement.offsetHeight,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateMenuPosition();
    }
  }, [activeMenu, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        updateMenuPosition();
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const handleScroll = () => {
      if (isOpenRef.current) updateMenuPosition();
    };

    const handleWindowResize = () => {
      if (isOpenRef.current) updateMenuPosition();
    };

    navEl.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleWindowResize);
    return () => {
      navEl.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleMenuClick = (
    path: string,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    setActiveMenu(path);
    router.push(path);
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  return (
    <aside
      className={`flex h-screen flex-col bg-white dark:bg-slate-900 transition-all duration-300 overflow-hidden ${
        isOpen
          ? "w-64 border-r border-slate-200 dark:border-slate-800"
          : "w-0"
      }`}
    >
      <div className="w-64 shrink-0 flex flex-col h-full">
        <div className="flex gap-3 p-6 shrink-0">
          <div
            className="bg-center bg-white dark:bg-[#1a2632] bg-no-repeat bg-cover rounded-full size-10 shrink-0 bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary"
            data-alt="Abstract geometric logo in blue"
            style={{
              backgroundImage: 'url("/logo.png")',
            }}
          ></div>
          <div className="flex flex-col justify-center">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">
              Mahkota Drive
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
              Fleet Rental System
            </p>
          </div>
        </div>

        <nav
          ref={navRef}
          className="flex-1 overflow-y-auto flex flex-col gap-2 relative px-6"
        >
          <div
            className="absolute bg-primary/10 rounded-lg transition-all duration-300 ease-in-out pointer-events-none"
            style={{
              top: menuPosition.top,
              height: menuPosition.height,
              left: "12px",
              right: "12px",
            }}
          />

          {filteredMenuItems.map((item) => (
            <a
              key={item.path}
              ref={(el) => {
                menuRefs.current[item.path] = el;
              }}
              className={`flex items-center rounded-lg relative z-10 transition-colors cursor-pointer ${
                activeMenu === item.path
                  ? "text-primary"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              } gap-3 px-3 py-2.5`}
              onClick={(e) => handleMenuClick(item.path, e)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <p className="text-sm font-medium leading-normal">
                {item.label}
              </p>
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-1 shrink-0 border-t border-slate-200 dark:border-slate-800 px-2">
          <a
            className="flex items-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer gap-3 px-6 py-2.5"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium leading-normal">Logout</p>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
