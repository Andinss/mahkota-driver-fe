"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface FinancialRentalProps {
  onDataChange?: (data: { 
    dailyRate: number;
    depositAmount: number;
    methodPayment?: string;
   }) => void;
  initialData?: {
    dailyRate?: number;
    depositAmount?: number;
    methodPayment?: string;
  }
} 



const FinancialRental = ({ onDataChange, initialData }: FinancialRentalProps) => {
  const [dailyRate, setDailyRate] = useState<number>(initialData?.dailyRate || 0);
  const [depositAmount, setDepositAmount] = useState<number>(initialData?.depositAmount || 0);
  const [methodPayment, setMethodPayment] = useState<string>(initialData?.methodPayment || "Bank");

  useEffect(() => {
    console.log("Financial initialData:", initialData);

    if (initialData?.dailyRate !== undefined) {
      setDailyRate(initialData.dailyRate);
    }
    if (initialData?.depositAmount !== undefined) {
      setDepositAmount(initialData.depositAmount);
    }
    if (initialData?.methodPayment !== undefined) {
      setMethodPayment(initialData.methodPayment);
    } 
  }, [initialData]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        dailyRate,
        depositAmount,
        methodPayment,
      });
    }
  }, [dailyRate, depositAmount, methodPayment, onDataChange]);

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
              value={methodPayment}
              onChange={(e) => setMethodPayment(e.target.value)}
            >
              <option value="Bank">Bank</option>
              <option value="Property Parent">Property Parent</option>
              <option value="Own Yourself">Own Yourself</option>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialRental;
