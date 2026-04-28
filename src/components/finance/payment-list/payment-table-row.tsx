
'use client';

import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import Link from "next/link";

interface Payment {
  invoiceId: string;
  customer: {
    name: string;
    avatar?: string;
  };
  vehicle: {
    plate: string;
  };
  amount: string;
  dueDate: string;
  status: 'Late' | 'Pending Review' | 'Paid';
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

const statusConfig = {
  Late: {
    className: "bg-red-100 text-[#e73908] dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900/50",
  },
  "Pending Review": {
    className: "bg-orange-100 text-[#d97706] dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50",
  },
  Paid: {
    className: "bg-green-100 text-[#078838] dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50",
  },
};

export const PaymentTableRow = ({
  payment,
  onValidate,
  onDetails,
  onDownload,
  onEdit,
  onDelete,
}: PaymentTableRowProps) => {
  const isPending = payment.status === 'Pending Review';
  const isLate = payment.status === 'Late';
  const isPaid = payment.status === 'Paid';

  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group ${
      isPending ? 'bg-primary/[0.02] dark:bg-primary/[0.05] border-l-2 border-l-primary' : ''
    }`}>
      <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">
        {payment.invoiceId}
      </td>

      <td className="px-6 py-4 text-[#111418] dark:text-gray-300">
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-full bg-cover bg-center bg-slate-200 dark:bg-slate-700"
            style={payment.customer.avatar ? { backgroundImage: `url("${payment.customer.avatar}")` } : {}}
          >
            {!payment.customer.avatar && (
              <div className="w-full h-full flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                {payment.customer.name.charAt(0)}
              </div>
            )}
          </div>
          {payment.customer.name}
        </div>
      </td>

      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">
        {payment.vehicle.plate}
      </td>

      <td className="px-6 py-4 font-semibold text-[#111418] dark:text-white">
        {payment.amount}
      </td>

      <td className={`px-6 py-4 font-medium ${isLate ? 'text-[#e73908]' : 'text-[#617589] dark:text-gray-400'}`}>
        {payment.dueDate}
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[payment.status].className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {payment.status}
        </span>
      </td>

      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">
        {payment.method}
      </td>

      <td className="py-4 px-6 text-right">
        <Dropdown
          trigger={
            <button className="text-[#617589] hover:text-[#111418] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          }
        >
          <Link href={`/dashboard/finance/payment?id=${payment.invoiceId.replace("#", "")}`}>
  <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
</Link>
          <DropdownMenuItem icon="delete" danger onClick={() => onDelete?.(payment)}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem icon="details" onClick={() => onDetails?.(payment)}>
            Details
          </DropdownMenuItem>
        </Dropdown>
      </td>
    </tr>
  );
};