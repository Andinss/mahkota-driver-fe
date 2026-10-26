"use client";

import { ToastContainer, toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sanitizeErrorMessage } from "@/lib/utils/error-message";

let toastCounter = 0;

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastStyle={{
        borderRadius: "12px",
        fontWeight: 600,
        fontSize: "14px",
        border: "1px solid #e2e8f0",
        padding: "12px 16px",
      }}
    />
  );
}

function makeToastId(msg: string) {
  return `toast-${msg.slice(0, 40)}`;
}

/**
 * Toast dengan pesan yang sama dalam waktu singkat tidak ditampilkan
 * berulang (mis. beberapa request gagal bersamaan / polling yang error).
 */
const DEDUPE_WINDOW_MS = 8000;
const lastShownAt = new Map<string, number>();

function isDuplicate(id: string): boolean {
  const now = Date.now();
  const last = lastShownAt.get(id);
  if (last && now - last < DEDUPE_WINDOW_MS) return true;
  // Jaga agar map tidak tumbuh tanpa batas pada sesi panjang.
  if (lastShownAt.size > 200) lastShownAt.clear();
  lastShownAt.set(id, now);
  return false;
}

const baseOpts: ToastOptions = {
  autoClose: 3000,
  hideProgressBar: false,
};

export function toastSuccess(msg: string) {
  const id = makeToastId(msg);
  toast.dismiss(id);
  toast.success(msg, {
    ...baseOpts,
    toastId: id,
    autoClose: 5000,
    style: { borderLeft: "4px solid var(--toast-success-accent, #2563eb)" },
  } as ToastOptions);
}

export function toastError(msg: string) {
  const text = sanitizeErrorMessage(msg);
  const id = makeToastId(text);
  if (isDuplicate(id)) return;
  toast.dismiss(id);
  toast.error(text, {
    ...baseOpts,
    toastId: id,
    style: { borderLeft: "4px solid #dc2626" },
  } as ToastOptions);
}

export function toastWarning(msg: string, toastId?: string) {
  const text = sanitizeErrorMessage(msg);
  const id = toastId ?? makeToastId(text);
  if (isDuplicate(id)) return;
  toast.dismiss(id);
  toast.warning(text, {
    ...baseOpts,
    toastId: id,
    autoClose: toastId ? 8000 : 3000,
    style: { borderLeft: "4px solid #f59e0b" },
  } as ToastOptions);
}

export function toastInfo(msg: string) {
  const text = sanitizeErrorMessage(msg);
  const id = makeToastId(text);
  if (isDuplicate(id)) return;
  toast.dismiss(id);
  toast.info(text, {
    ...baseOpts,
    toastId: id,
    style: { borderLeft: "4px solid #3b82f6" },
  } as ToastOptions);
}

/* ========== Confirm Toast ========== */

interface ConfirmToastOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  disabled?: boolean;
}

const variantConfig: Record<string, { icon: string; border: string; btnBg: string }> = {
  danger:  { icon: "warning", border: "#dc2626", btnBg: "#dc2626" },
  warning: { icon: "warning", border: "#f59e0b", btnBg: "#f59e0b" },
  info:    { icon: "info",    border: "#3b82f6", btnBg: "#3b82f6" },
};

export function confirmToast({
  title,
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "danger",
  disabled = false,
}: ConfirmToastOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const cfg = variantConfig[variant];
    const id = `confirm-${++toastCounter}`;

    toast(
      ({ closeToast }) => {
        const handleConfirm = () => {
          if (disabled) return;
          closeToast();
          resolve(true);
        };
        const handleCancel = () => {
          closeToast();
          resolve(false);
        };

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 260, maxWidth: 320, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: variant === "danger" ? "#fef2f2" : "#eff6ff",
                color: cfg.border,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{cfg.icon}</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{title}</span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{message}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={handleCancel} style={{ padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: "#f1f5f9", color: "#475569" }}>
                {cancelText}
              </button>
              <button onClick={handleConfirm} disabled={disabled} style={{ padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", border: "none", background: disabled ? "#94a3b8" : cfg.btnBg, color: "white" }}>
                {confirmText}
              </button>
            </div>
          </div>
        );
      },
      {
        toastId: id,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        style: { borderLeft: `4px solid ${cfg.border}` },
      }
    );
  });
}
