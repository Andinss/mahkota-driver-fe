import { ReactNode } from "react";
import { Modal } from "./modal";
import { Button } from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

const variantStyles: Record<"danger" | "warning" | "info", { icon: string; color: string }> = {
  danger: { icon: "warning", color: "text-red-500" },
  warning: { icon: "warning", color: "text-amber-500" },
  info: { icon: "info", color: "text-blue-500" },
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) => {
  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="p-6 text-center">
        <div className={`mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800`}>
          <span className={`material-symbols-outlined text-2xl ${styles.color}`}>
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
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
