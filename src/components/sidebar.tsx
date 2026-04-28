"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, height: 0 });
  const menuRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const isCollapsedRef = useRef(isCollapsed);
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(pathname);

  useEffect(() => {
    setActiveMenu(pathname);
  }, [pathname]);

  useEffect(() => {
    isCollapsedRef.current = isCollapsed;
  }, [isCollapsed]);

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
    const activeElement = menuRefs.current[activeMenu];
    if (activeElement) {
      const rect = activeElement.getBoundingClientRect();
      const parentRect = activeElement.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setMenuPosition({
          top: rect.top - parentRect.top,
          height: rect.height,
        });
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateMenuPosition();
    }, 50);

    return () => clearTimeout(timeout);
  }, [activeMenu]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateMenuPosition();
    }, 350);

    return () => clearTimeout(timeout);
  }, [isCollapsed]);

  useEffect(() => {
    const handleWindowResize = () => {
      updateMenuPosition();
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [activeMenu, isCollapsed]);

  const handleMenuClick = (
    path: string,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    setActiveMenu(path);
    router.push(path);
  };

  return (
    <aside
      className={`flex h-screen flex-col justify-between border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`flex flex-col gap-4 ${isCollapsed ? "items-center" : ""}`}
      >
        <div
          className={`flex gap-3 ${isCollapsed ? "justify-center py-4" : "p-6"}`}
        >
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 bg-primary/10 flex items-center justify-center text-primary"
            data-alt="Abstract geometric logo in blue"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCayM1M4BEeHDgBMWOgZ-6uVXx5vWpf8Q0WTsKUzvldl1p7wGBhz8LOrA1xzQNa269xSDgExCrWIrwoyLvM_3e_4BQCB9or-J0tXoN1CKS_9V60GlgcOacU_zYTvYR9QisxOJcc87ZQ43di2V_uNl_S_n_zIBHNpjR2aerjOR1V_O5YVIRFBfStuhKBHCVFmWao5vX2Jlskc_9f6q9bh5nf8656za2up0uFQRefaGYj9lwf6wFRS_3wSLaM4QeNLnrsqR1SoqmWGGQ4")',
            }}
          ></div>
          {!isCollapsed && (
            <div className="flex flex-col justify-center">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                PT XYZ Admin
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
                Rental System
              </p>
            </div>
          )}
        </div>

        <nav
          className={`flex flex-col gap-2 mt-4 relative ${!isCollapsed ? "px-6" : ""}`}
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

          <a
            ref={(el) => {
              menuRefs.current["/dashboard"] = el;
            }}
            className={`flex items-center rounded-lg relative z-10 transition-colors cursor-pointer ${
              activeMenu === "/dashboard"
                ? "text-primary"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } ${
              isCollapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5"
            }`}
            onClick={(e) => handleMenuClick("/dashboard", e)}
          >
            <span className="material-symbols-outlined">dashboard</span>
            {!isCollapsed && (
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            )}
          </a>
          <a
            ref={(el) => {
              menuRefs.current["/dashboard/driver"] = el;
            }}
            className={`flex items-center rounded-lg relative z-10 transition-colors group cursor-pointer ${
              activeMenu === "/dashboard/driver"
                ? "text-primary"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } ${
              isCollapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5"
            }`}
            onClick={(e) => handleMenuClick("/dashboard/driver", e)}
          >
            <span className="material-symbols-outlined transition-colors">
              badge
            </span>
            {!isCollapsed && (
              <p className="text-sm font-medium leading-normal">
                Driver Management
              </p>
            )}
          </a>

          <a
            ref={(el) => {
              menuRefs.current["/dashboard/vehicle"] = el;
            }}
            className={`flex items-center rounded-lg relative z-10 transition-colors group cursor-pointer ${
              activeMenu === "/dashboard/vehicle"
                ? "text-primary"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } ${
              isCollapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5"
            }`}
            onClick={(e) => handleMenuClick("/dashboard/vehicle", e)}
          >
            <span className="material-symbols-outlined transition-colors">
              directions_car
            </span>
            {!isCollapsed && (
              <p className="text-sm font-medium leading-normal">
                Vehicle Management
              </p>
            )}
          </a>
          <a
            ref={(el) => {
              menuRefs.current["/dashboard/rent"] = el;
            }}
            className={`flex items-center rounded-lg relative z-10 transition-colors group cursor-pointer ${
              activeMenu === "/dashboard/rent"
                ? "text-primary"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } ${
              isCollapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5"
            }`}
            onClick={(e) => handleMenuClick("/dashboard/rent", e)}
          >
            <span className="material-symbols-outlined transition-colors">
              contract
            </span>
            {!isCollapsed && (
              <p className="text-sm font-medium leading-normal">
                Rentals Management
              </p>
            )}
          </a>
          <a
            ref={(el) => {
              menuRefs.current["/dashboard/users"] = el;
            }}
            className={`flex items-center rounded-lg relative z-10 transition-colors group cursor-pointer ${
              activeMenu === "/dashboard/users"
                ? "text-primary"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } ${
              isCollapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5"
            }`}
            onClick={(e) => handleMenuClick("/dashboard/users", e)}
          >
            <span className="material-symbols-outlined transition-colors">
              people
            </span>
            {!isCollapsed && (
              <p className="text-sm font-medium leading-normal">
                User Management
              </p>
            )}
          </a>

          <a
            ref={(el) => {
              menuRefs.current["/dashboard/finance"] = el;
            }}
            className={`flex items-center rounded-lg relative z-10 transition-colors group cursor-pointer ${
              activeMenu === "/dashboard/finance"
                ? "text-primary"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } ${
              isCollapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5"
            }`}
            onClick={(e) => handleMenuClick("/dashboard/finance", e)}
          >
            <span className="material-symbols-outlined transition-colors">
              finance
            </span>
            {!isCollapsed && (
              <p className="text-sm font-medium leading-normal">
                Finance Management
              </p>
            )}
          </a>

          <a
            ref={(el) => {
              menuRefs.current["/dashboard/setting"] = el;
            }}
            className={`flex items-center rounded-lg relative z-10 transition-colors group cursor-pointer ${
              activeMenu === "/settings"
                ? "text-primary"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } ${
              isCollapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5"
            }`}
            onClick={(e) => handleMenuClick("/dashboard/setting", e)}
          >
            <span className="material-symbols-outlined transition-colors">
              settings
            </span>
            {!isCollapsed && (
              <p className="text-sm font-medium leading-normal">Settings</p>
            )}
          </a>
        </nav>
      </div>

      <div
        className={`flex flex-col gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 ${!isCollapsed ? "px-2" : ""}`}
      >
        <a
          className={`flex items-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer ${
            isCollapsed
              ? "justify-center w-12 h-12 mx-auto"
              : "gap-3 px-6 py-2.5"
          }`}
          onClick={(e) => {
            e.preventDefault();
          }}
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
