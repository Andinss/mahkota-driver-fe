"use client";

import { Badge } from "@/components/ui/badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import Link from "next/link";
import type { FinanceItem } from "@/lib/types/finances";

interface PaymentTableRowProps {
  payment: FinanceItem;
  onValidate?: (payment: FinanceItem) => void;
  onDetails?: (payment: FinanceItem) => void;
  onDownload?: (payment: FinanceItem) => void;
  onEdit?: (payment: FinanceItem) => void;
  onDelete?: (payment: FinanceItem) => void;
}

const formatCurrency = (value: string) => {
  const num = parseFloat(value.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const methodLabel: Record<string, string> = {
  cash: "Cash",
  transfer: "Transfer",
  "e-wallet": "E-Wallet",
};

export const PaymentTableRow = ({
  payment,
  onValidate,
  onDetails,
  onDownload,
  onEdit,
  onDelete,
}: PaymentTableRowProps) => {
  const isActive = payment.is_active;

  return (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
      <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">
        {payment.reference_number}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-xs font-medium">
            {payment.payer.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {payment.payer}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 font-semibold text-[#111418] dark:text-white">
        {formatCurrency(payment.amount_received)}
      </td>

      <td className="px-6 py-4 font-medium text-[#617589] dark:text-gray-400">
        {formatDate(payment.payment_date)}
      </td>

      <td className="px-6 py-4">
        <Badge
          variant={isActive ? "success" : "neutral"}
          dot
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </td>

      <td className="px-2 py-4 text-[#617589] dark:text-gray-400">
        {methodLabel[payment.payment_method] || payment.payment_method}
      </td>

      <td className="py-4 px-6 text-right">
        <Dropdown
          trigger={
            <button className="text-[#617589] hover:text-[#111418] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/finance/payment?id=${payment.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem icon="delete" danger onClick={() => onDelete?.(payment)}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem icon="visibility" onClick={() => onDetails?.(payment)}>
            Details
          </DropdownMenuItem>
        </Dropdown>
      </td>
    </tr>
  );
};