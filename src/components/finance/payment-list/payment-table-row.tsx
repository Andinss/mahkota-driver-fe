"use client";

import { Badge } from "@/components/ui/badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import Link from "next/link";
import type { FinanceItem } from "@/lib/types/finances";

const imageBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

const photoUrl = (path?: string) =>
  path
    ? path.startsWith("http")
      ? path
      : `${imageBase}/${path.replace(/^\//, "")}`
    : "";

interface PaymentTableRowProps {
  payment: FinanceItem;
  onValidate?: (payment: FinanceItem) => void;
  onDetails?: (payment: FinanceItem) => void;
  onDownload?: (payment: FinanceItem) => void;
  onEdit?: (payment: FinanceItem) => void;
  onDelete?: (payment: FinanceItem) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatShortDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const statusLabel: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  pending: "Pending",
  partially_paid: "Partially Paid",
  cancelled: "Cancelled",
};

const statusVariant: Record<
  string,
  "success" | "info" | "warning" | "neutral"
> = {
  paid: "success",
  unpaid: "neutral",
  pending: "warning",
  partially_paid: "info",
  cancelled: "neutral",
};

const methodLabel: Record<string, string> = {
  cash: "Cash",
  transfer: "Transfer",
  "e-wallet": "E-Wallet",
  saldo: "Saldo",
};

export const PaymentTableRow = ({
  payment,
  onValidate,
  onDetails,
  onDownload,
  onEdit,
  onDelete,
}: PaymentTableRowProps) => {
  const driverName = payment.driver
    ? `${payment.driver.first_name} ${payment.driver.last_name}`
    : payment.payer;
  const avatarUrl = photoUrl(payment.driver?.profile_photo) || "";

  const vehicleInfo = payment.vehicle || payment.rentals?.[0]?.vehicle;
  const vendorInfo =
    payment.vendor ||
    vehicleInfo?.vendor ||
    payment.rentals?.[0]?.vendor ||
    payment.rentals?.[0]?.vehicle?.vendor;

  const latestPaymentDate = (() => {
    const payments = payment.payments || [];
    if (payments.length === 0) return payment.payment_date;
    return payments
      .slice()
      .sort(
        (a, b) =>
          new Date(a.payment_date).getTime() -
          new Date(b.payment_date).getTime(),
      )
      .pop()!.payment_date;
  })();

  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors group">
      <td className="px-6 py-4">
        <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
          {payment.reference_number}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-xs font-medium">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={driverName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              driverName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {driverName}
            </p>
            {payment.driver?.employee_id && (
              <p className="text-xs text-slate-400">
                {payment.driver.employee_id}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {vehicleInfo ? (
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {vehicleInfo.merk} {vehicleInfo.model}
            </p>
            <p className="text-xs text-slate-400 font-mono">
              {vehicleInfo.license_plate}
            </p>
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
        {vendorInfo?.name || "-"}
      </td>
      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
        {formatCurrency(payment.total_amount ?? payment.amount_received ?? 0)}
      </td>
      <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
        {formatCurrency(payment.paid_amount ?? payment.amount_received ?? 0)}
      </td>
      <td className="px-6 py-4 font-semibold text-orange-500">
        {formatCurrency(payment.remaining_amount ?? 0)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-900 dark:text-white">
            {payment.payments_count ?? payment.payments?.length ?? 0}
          </span>
          <span className="text-xs text-slate-400">
            / {payment.payment_terms ?? 1} kali
          </span>
        </div>
      </td>
      <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
        {payment.deposit_amount ? formatCurrency(payment.deposit_amount) : "-"}
      </td>
      <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
        {payment.rentals?.[0]?.start_date && payment.rentals?.[0]?.end_date
          ? `${formatShortDate(payment.rentals[0].start_date)} - ${formatShortDate(payment.rentals[0].end_date)}`
          : "-"}
      </td>
      <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
        {formatDate(latestPaymentDate)}
      </td>
      <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
        {formatDate(payment.created_at || payment.payment_date)}
      </td>
      <td className="px-6 py-4">
        <Badge variant={statusVariant[payment.status] || "neutral"} dot>
          {statusLabel[payment.status] || payment.status}
        </Badge>
      </td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
        {methodLabel[payment.payment_method] || payment.payment_method}
      </td>
      <td className="px-6 py-4 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/finances/payment?id=${payment.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            icon="delete"
            danger
            onClick={() => onDelete?.(payment)}
          >
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            icon="visibility"
            onClick={() => onDetails?.(payment)}
          >
            Details
          </DropdownMenuItem>
        </Dropdown>
      </td>
    </tr>
  );
};
