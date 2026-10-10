"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

interface MenuItem {
  type?: "item";
  path: string;
  label: string;
  icon: string;
  permission: string;
}

interface MenuGroup {
  type: "group";
  label: string;
  icon: string;
  children: MenuItem[];
}

type SidebarItem = MenuItem | MenuGroup;

function isGroup(item: SidebarItem): item is MenuGroup {
  return item.type === "group";
}

const menuStructure: SidebarItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard", permission: "" },
  {
    type: "group",
    label: "Fleet Operations",
    icon: "directions_car",
    children: [
      {
        path: "/dashboard/drivers",
        label: "Drivers",
        icon: "badge",
        permission: "driver.read.all",
      },
      {
        path: "/dashboard/vehicles",
        label: "Vehicles",
        icon: "car_repair",
        permission: "vehicle.read",
      },
      {
        path: "/dashboard/monitorings",
        label: "Monitoring",
        icon: "monitoring",
        permission: "monitoring.read",
      },
      {
        path: "/dashboard/vendor-vehicles",
        label: "Vendor Vehicles",
        icon: "storefront",
        permission: "vendor.read",
      },
    ],
  },
  {
    type: "group",
    label: "Transactions",
    icon: "receipt_long",
    children: [
      {
        path: "/dashboard/rentals",
        label: "Rentals",
        icon: "contract",
        permission: "rental.read",
      },
      {
        path: "/dashboard/finances",
        label: "Finance",
        icon: "account_balance",
        permission: "finance.read",
      },
      {
        path: "/dashboard/memberships",
        label: "Memberships",
        icon: "card_membership",
        permission: "",
      },
      {
        path: "/dashboard/rekenings",
        label: "Metode Bayar",
        icon: "account_balance_wallet",
        permission: "",
      },
    ],
  },

  {
    type: "group",
    label: "System",
    icon: "admin_panel_settings",
    children: [
      {
        path: "/dashboard/users",
        label: "Users",
        icon: "people",
        permission: "user.read",
      },
      {
        path: "/dashboard/roles",
        label: "Roles",
        icon: "shield",
        permission: "role.read",
      },
      {
        path: "/dashboard/setting",
        label: "Settings",
        icon: "settings",
        permission: "setting.read",
      },
    ],
  },
  {
    path: "/dashboard/audit-logs",
    label: "Audit Logs",
    icon: "description",
    permission: "audit.read",
  },
];

const Sidebar = () => {
  const { user, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [menuPosition, setMenuPosition] = useState({ top: 0, height: 0 });
  const menuRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const groupHeaderRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {},
  );
  const isOpenRef = useRef(isOpen);
  const navRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(pathname);
  const activeMenuRef = useRef(activeMenu);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const expandedGroupsRef = useRef(expandedGroups);

  const hasPermissions =
    Array.isArray(user?.permissions) && user.permissions.length > 0;

  const checkAccess = useCallback(
    (permission: string) => {
      if (!permission || !hasPermissions) return true;
      if (canAccess(user?.permissions, permission)) return true;
      if (
        permission === "driver.read.all" &&
        canAccess(user?.permissions, "driver.read.own")
      )
        return true;
      return false;
    },
    [user?.permissions, hasPermissions],
  );

  const filterMenu = useCallback(
    (items: SidebarItem[]): SidebarItem[] => {
      if (isLoading) return [];
      return items
        .map((item) => {
          if (isGroup(item)) {
            const filteredChildren = item.children.filter((child) =>
              checkAccess(child.permission),
            );
            if (filteredChildren.length === 0) return null;
            return { ...item, children: filteredChildren };
          }
          if (!checkAccess(item.permission)) return null;
          return item;
        })
        .filter(Boolean) as SidebarItem[];
    },
    [isLoading, checkAccess],
  );

  const filteredMenu = filterMenu(menuStructure);

  const isChildActive = useCallback(
    (item: MenuGroup) => {
      return item.children.some((child) => pathname === child.path);
    },
    [pathname],
  );

  useEffect(() => {
    setActiveMenu(pathname);
    setExpandedGroups((prev) => {
      const next = { ...prev };
      for (const item of menuStructure) {
        if (isGroup(item) && item.children.some((c) => pathname === c.path)) {
          next[item.label] = true;
        }
      }
      return next;
    });
  }, [pathname]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    activeMenuRef.current = activeMenu;
  }, [activeMenu]);

  useEffect(() => {
    expandedGroupsRef.current = expandedGroups;
  }, [expandedGroups]);

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

  const updateMenuPosition = useCallback(() => {
    const currentActive = activeMenuRef.current;
    const activeElement = menuRefs.current[currentActive];

    if (activeElement) {
      const parentGroup = activeElement.closest("[data-group-label]");
      if (parentGroup) {
        const groupLabel = parentGroup.getAttribute("data-group-label");
        const isGroupExpanded = expandedGroupsRef.current[groupLabel || ""];
        if (!isGroupExpanded) {
          const headerBtn = groupHeaderRefs.current[groupLabel || ""];
          if (headerBtn) {
            setMenuPosition({
              top: headerBtn.offsetTop,
              height: headerBtn.offsetHeight,
            });
            return;
          }
        }
      }

      setMenuPosition({
        top: activeElement.offsetTop,
        height: activeElement.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateMenuPosition();
      const timeout = setTimeout(() => {
        updateMenuPosition();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [activeMenu, isOpen, expandedGroups, updateMenuPosition]);

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        updateMenuPosition();
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, updateMenuPosition]);

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
  }, [updateMenuPosition]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

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
        isOpen ? "w-64 border-r border-slate-200 dark:border-slate-800" : "w-0"
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
              Fleet Rental System
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

          {filteredMenu.map((item) => {
            if (isGroup(item)) {
              const expanded = !!expandedGroups[item.label];
              const active = isChildActive(item);

              return (
                <div
                  key={item.label}
                  className="flex flex-col"
                  data-group-label={item.label}
                >
                  <button
                    ref={(el) => {
                      groupHeaderRefs.current[item.label] = el;
                    }}
                    onClick={() => toggleGroup(item.label)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer relative z-10 w-full text-left ${
                      active
                        ? "text-primary"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    <svg
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        expanded ? "rotate-90" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <div
                    ref={(el) => {
                      groupRefs.current[item.label] = el;
                    }}
                    className="overflow-hidden transition-all duration-200 ease-in-out"
                    style={{
                      maxHeight: expanded
                        ? `${item.children.length * 44 + 8}px`
                        : "0px",
                      opacity: expanded ? 1 : 0,
                    }}
                  >
                    <div className="pl-4 flex flex-col gap-0.5 border-l-2 border-slate-200 dark:border-slate-700 ml-5 my-1">
                      {item.children.map((child) => (
                        <a
                          key={child.path}
                          ref={(el) => {
                            menuRefs.current[child.path] = el;
                          }}
                          className={`flex items-center rounded-lg relative z-10 transition-colors cursor-pointer gap-3 px-3 py-2 text-sm ${
                            activeMenu === child.path
                              ? "text-primary font-medium"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          }`}
                          onClick={(e) => handleMenuClick(child.path, e)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {child.icon}
                          </span>
                          <span className="truncate">{child.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.path}
                ref={(el) => {
                  menuRefs.current[item.path] = el;
                }}
                className={`flex items-center rounded-lg relative z-10 transition-colors cursor-pointer gap-3 px-3 py-2.5 ${
                  activeMenu === item.path
                    ? "text-primary"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                onClick={(e) => handleMenuClick(item.path, e)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="text-sm font-medium leading-normal">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex flex-col gap-1 shrink-0 border-t border-slate-200 dark:border-slate-800 px-2 py-2">
          <a
            className="flex items-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer gap-3 px-3 py-2.5"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            <p className="text-sm font-medium leading-normal">Logout</p>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
