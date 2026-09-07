"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { confirmToast } from "@/components/ui/toast-provider";

interface CardDetailProps {
  driverId: string;
  name: string;
  imageUrl: string;
  joinedDate?: string;
  vehicle: string;
  plate: string;
  dueDate: string;
  paymentDate: string;
  amount: string;
  justification: string;
  justificationReason: string;
  message: string;
  proofImageUrl: string;
  submittedTime?: string;
  onReject?: (note?: string) => void;
  onApprove?: (note?: string) => void;
  onViewProfile?: () => void;
}

export function CardDetail({
  driverId,
  name,
  imageUrl,
  joinedDate = "Jan 2022",
  vehicle,
  plate,
  dueDate,
  paymentDate,
  amount,
  justification: _justification,
  justificationReason,
  message,
  proofImageUrl,
  submittedTime = "2 hours ago",
  onReject,
  onApprove,
  onViewProfile,
}: CardDetailProps) {
  const [adminNote, setAdminNote] = useState("");

  const handleReject = async () => {
    const confirmed = await confirmToast({
      title: "Reject Request?",
      message: "This action cannot be undone. The driver will be notified of the rejection.",
      confirmText: "Yes, Reject",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (confirmed) onReject?.(adminNote);
  };

  const handleApprove = async () => {
    const confirmed = await confirmToast({
      title: "Approve Request?",
      message: "This will mark the late payment as resolved. A confirmation will be sent to the driver.",
      confirmText: "Yes, Approve",
      cancelText: "Cancel",
      variant: "info",
    });
    if (confirmed) onApprove?.(adminNote);
  };

  return (
    <>
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
      {/* Detail Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-4">
          <img
            alt={name}
            className="size-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover"
            src={imageUrl}
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {name}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-lg">badge</span>
              <span>Driver ID: {driverId}</span>
              <span>•</span>
              <span className="capitalize">{name}</span>
              <span>•</span>
              <span>Joined {joinedDate}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Review Required
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Submitted {submittedTime}
          </p>
        </div>
      </div>

      {/* Detail Content */}
      <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
        {/* Transaction Info Grid */}
        <div className="mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">
              receipt_long
            </span>
            Transaction Details
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tight mb-1">
                Vehicle
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {vehicle}
              </p>
              <p className="text-xs text-slate-400">{plate}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tight mb-1">
                Due Date
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {dueDate}
              </p>
              <p className="text-xs text-slate-400">14:00 PM</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
              <p className="text-xs text-rose-600 dark:text-rose-400 uppercase font-bold tracking-tight mb-1">
                Payment Date
              </p>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                {paymentDate}
              </p>
              <p className="text-xs text-rose-500 font-medium">
                +2 Days Late
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-primary uppercase font-bold tracking-tight mb-1">
                Total Amount
              </p>
              <p className="text-lg font-black text-primary">{amount}</p>
            </div>
          </div>
        </div>

        {/* Justification & Proof Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">
                chat_bubble_outline
              </span>
              Driver Justification
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
              <h5 className="font-bold text-slate-900 dark:text-white mb-2">
                Reason: {justificationReason}
              </h5>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">
                image
              </span>
              Proof of Issue
            </h4>
            <div className="group relative bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 h-48 w-full overflow-hidden flex items-center justify-center cursor-zoom-in">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-100 transition-opacity"
                style={{ backgroundImage: `url("${proofImageUrl}")` }}
              ></div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span>{" "}
                Click to view
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">
                history
              </span>
              Recent History
            </h4>
            <button
              className="text-xs text-primary font-bold uppercase tracking-wider hover:underline"
              onClick={onViewProfile}
            >
              View Full Profile
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">
                    Sep 01, 2023
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    Vehicle Return
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-500 font-bold">On Time</span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-900 dark:text-white">
                    {amount}
                  </td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">
                    Aug 15, 2023
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    Vehicle Return
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-500 font-bold">On Time</span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-900 dark:text-white">
                    {amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Detail Footer Actions */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col gap-4">
        <div>
          <Input
            label="Note for Driver (Optional)"
            placeholder="e.g., Waiving fee due to system outage verified..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button icon="close" onClick={handleReject}>
            Reject
          </Button>
          <Button icon="check" onClick={handleApprove}>
            Approve Request
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}

export default CardDetail;
