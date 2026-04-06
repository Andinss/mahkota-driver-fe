"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface FinancialRentalProps {
  onDataChange?: (data: { dailyRate: number; depositAmount: number }) => void;
}

const FinancialRental = ({ onDataChange }: FinancialRentalProps) => {
  const [dailyRate, setDailyRate] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        dailyRate,
        depositAmount,
      });
    }
  }, [dailyRate, depositAmount, onDataChange]);

  const handleDailyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setDailyRate(Number(value));
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setDepositAmount(Number(value));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
          3
        </span>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
          Financial Details
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="relative">
            <Input
              id="dailyRate"
              name="dailyRate"
              label="Daily Rate (IDR)"
              placeholder="Enter daily rate"
              className="uppercase"
              required
              value={dailyRate ? formatCurrency(dailyRate) : ""}
              onChange={handleDailyRateChange}
            />
          </div>
          <p className="text-[10px] text-slate-500 italic">
            *Auto-filled from vehicle data
          </p>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <Input
              id="depositAmount"
              name="depositAmount"
              label="Deposit Amount (IDR)"
              placeholder="Enter deposit amount"
              className="uppercase"
              required
              value={depositAmount ? formatCurrency(depositAmount) : ""}
              onChange={handleDepositChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <Select
              id="methodPayment"
              name="methodPayment"
              label="Method Payment"
            >
              <option>Bank</option>
              <option>Property Parent</option>
              <option>Own Youself</option>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialRental;
