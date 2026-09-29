import { ReactNode, useRef, useEffect, useState } from "react";
import { Icon } from "./icon";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export const Dropdown = ({ trigger, children, align = "right" }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>
      {isOpen && (
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 w-48 bg-white dark:bg-[#1a2632] rounded-lg border border-[#e5e7eb] dark:border-[#2a3845] shadow-lg py-1 z-50`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownMenuItemProps {
  onClick?: () => void;
  icon?: string;
  danger?: boolean;
  children: ReactNode;
}

export const DropdownMenuItem = ({ onClick, icon, danger = false, children }: DropdownMenuItemProps) => {
  return (
    <button
      onClick={() => {
        onClick?.();
      }}
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#f9fafb] dark:hover:bg-[#23303d] transition-colors ${
        danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-[#111418] dark:text-white"
      }`}
    >
      {icon && <Icon name={icon} size="sm" />}
      {children}
    </button>
  );
};
