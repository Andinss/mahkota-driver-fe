"use client";

import { Badge } from "@/components/ui/badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import Link from "next/link";

interface Payment {
  invoiceId: string;
  customer: {
    name: string;
    id?: string;
    avatar?: string;
  };
  vehicle: {
    plate: string;
  };
  amount: string;
  dueDate: string;
  status: "Late" | "Pending Review" | "Paid";
  method: string;
}

interface PaymentTableRowProps {
  payment: Payment;
  onValidate?: (payment: Payment) => void;
  onDetails?: (payment: Payment) => void;
  onDownload?: (payment: Payment) => void;
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}


export const PaymentTableRow = ({
  payment,
  onValidate,
  onDetails,
  onDownload,
  onEdit,
  onDelete,
}: PaymentTableRowProps) => {
  const isPending = payment.status === "Pending Review";
  const isLate = payment.status === "Late";
  const isPaid = payment.status === "Paid";

  return (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
      <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">
        {payment.invoiceId}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
              {payment.customer.avatar ? (
              <img
                alt={payment.customer.name}
                src={payment.customer.avatar}
                className="w-full h-full object-cover"
              />
            ) : (

              <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-xs font-medium">
                {payment.customer.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
          <p className="font-semibold text-slate-900 dark:text-white">
          {payment.customer.name}
          </p>
          {payment.customer.id && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
                ID: {payment.customer.id}
              </p>
            )}
        </div>
        </div>
      </td>

      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">
        {payment.vehicle.plate}
      </td>

      <td className="px-6 py-4 font-semibold text-[#111418] dark:text-white">
        {payment.amount}
      </td>

      <td
        className={`px-6 py-4 font-medium ${isLate ? "text-[#e73908]" : "text-[#617589] dark:text-gray-400"}`}
      >
        {payment.dueDate}
      </td>

      <td className="px-6 py-4">
  <Badge 
    variant={
      payment.status === "Late" 
        ? "danger"     
        : payment.status === "Pending Review" 
          ? "warning" 
          : "success"
    }
    dot
  >
    {payment.status}
  </Badge>
</td>

      <td className="px-2 py-4 text-[#617589] dark:text-gray-400">
        {payment.method}
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
          <Link href={`/dashboard/finance/payment?id=${payment.invoiceId.replace("#", "")}`}>
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