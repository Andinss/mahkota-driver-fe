import { useEffect, useRef } from "react";
import { Modal } from "./modal";
import { Button } from "./button";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: "success" | "error" | "warning" | "info";
  autoCloseDelay?: number; // in ms, default 3000
}

const typeStyles: Record<
  "success" | "error" | "warning" | "info",
  { icon: string; color: string; bgColor: string }
> = {
  success: {
    icon: "check_circle",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  error: {
    icon: "error",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  warning: {
    icon: "warning",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  info: {
    icon: "info",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
};

export const AlertDialog = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "OK",
  type = "info",
  autoCloseDelay = 3000,
}: AlertDialogProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const styles = typeStyles[type];

  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, autoCloseDelay, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="p-6 text-center">
        <div
          className={`mx-auto mb-4 flex size-12 items-center justify-center rounded-full ${styles.bgColor}`}
        >
          <span
            className={`material-symbols-outlined text-2xl ${styles.color}`}
          >
            {styles.icon}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-[#617589] dark:text-[#94a3b8] mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant={type === "error" ? "danger" : "primary"}
            onClick={onClose}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
