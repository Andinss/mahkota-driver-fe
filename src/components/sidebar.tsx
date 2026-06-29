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
  { path: "/dashboard/monitoring", label: "Monitoring", icon: "monitoring", permission: "" },
  { path: "/dashboard/setting", label: "Settings", icon: "settings", permission: "" },
];

const Sidebar = () => {
  const { user, isLoading, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, height: 0 });
  const menuRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const isCollapsedRef = useRef(isCollapsed);
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
    isCollapsedRef.current = isCollapsed;
  }, [isCollapsed]);

  useEffect(() => {
    activeMenuRef.current = activeMenu;
  }, [activeMenu]);

  useEffect(() => {
    const handleToggle = () => {
      setIsCollapsed((prev) => !prev);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && isCollapsedRef.current) {
        setIsCollapsed(false);
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
    updateMenuPosition();
  }, [activeMenu]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateMenuPosition();
    }, 350);

    return () => clearTimeout(timeout);
  }, [isCollapsed]);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const handleScroll = () => {
      updateMenuPosition();
    };

    const handleWindowResize = () => {
      updateMenuPosition();
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
      className={`flex h-screen flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
        <div
          className={`flex gap-3 shrink-0 ${isCollapsed ? "justify-center py-4" : "p-6"}`}
        >
          <div
            className="bg-center bg-white bg-no-repeat bg-cover rounded-full size-10 shrink-0 bg-primary/10 flex items-center justify-center text-primary"
            data-alt="Abstract geometric logo in blue"
            style={{
              backgroundImage: 'url("/logo.png")',
            }}
          ></div>
          {!isCollapsed && (
            <div className="flex flex-col justify-center">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                Mahkota Drive
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
                Fleet Rental System
              </p>
            </div>
          )}
        </div>

        <nav
          ref={navRef}
          className={`flex-1 overflow-y-auto flex flex-col gap-2 relative ${!isCollapsed ? "px-6" : "items-center"}`}
        >
          <div
            className="absolute bg-primary/10 rounded-lg transition-all duration-300 ease-in-out pointer-events-none"
            style={{
              top: menuPosition.top,
              height: menuPosition.height,
              left: isCollapsed ? "calc(50% - 24px)" : "12px",
              right: isCollapsed ? "calc(50% - 24px)" : "12px",
              width: isCollapsed ? "48px" : "auto",
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
              } ${
                isCollapsed
                  ? "justify-center w-12 h-12 mx-auto"
                  : "gap-3 px-3 py-2.5"
              }`}
              onClick={(e) => handleMenuClick(item.path, e)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {!isCollapsed && (
                <p className="text-sm font-medium leading-normal">
                  {item.label}
                </p>
              )}
            </a>
          ))}
        </nav>

      <div
        className={`flex flex-col gap-1 shrink-0 border-t border-slate-200 dark:border-slate-800  ${!isCollapsed ? "px-2" : ""}`}
      >
        <a
          className={`flex items-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer ${
            isCollapsed
              ? "justify-center w-12 h-12 mx-auto"
              : "gap-3 px-6 py-2.5"
          }`}
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined">logout</span>
          {!isCollapsed && (
            <p className="text-sm font-medium leading-normal">Logout</p>
          )}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
