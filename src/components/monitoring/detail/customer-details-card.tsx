"use client";

import { Button } from "@/components/ui/button";

interface CustomerDetailsCardProps {
  customer: {
    name: string;
    initials: string;
    contractNumber: string;
    phoneNumber: string;
  };
}

export const CustomerDetailsCard = ({ customer }: CustomerDetailsCardProps) => {
  
  const handleWhatsApp = () => {
    const formattedNumber = customer.phoneNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e7edf3] dark:border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-[#e7edf3] dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/50">
        <h3 className="font-bold text-[#0d141b] dark:text-white">Customer Details</h3>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary font-bold text-lg">
            {customer.initials}
          </div>
          <div>
            <p className="font-bold text-[#0d141b] dark:text-white">{customer.name}</p>
            <p className="text-xs text-[#4c739a] dark:text-slate-400">Contract #{customer.contractNumber}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            icon="call"
            onClick={handleWhatsApp}
          >
            Call
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            icon="chat"
            onClick={handleWhatsApp}
          >
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};