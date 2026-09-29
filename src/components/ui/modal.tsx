import { ReactNode, useEffect } from "react";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative ${sizeStyles[size]} w-full mx-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-xl overflow-hidden animate-modalIn`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a3845]">
          <h2 className="text-lg font-bold text-[#111418] dark:text-white">
            {title}
          </h2>
          <IconButton
            name="close"
            size="sm"
            variant="default"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
