"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { Select } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface FormErrors {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  dailyRate?: string;
  depositAmount?: string;
}

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
  error?: FormErrors;
} 
 
 
const FinancialRental = ({ onDataChange, initialData, error }: FinancialRentalProps) => {
  const [dailyRate, setDailyRate] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [methodPayment, setMethodPayment] = useState<string>(initialData?.methodPayment || "Bank");

  useEffect(() => {
    if (initialData?.dailyRate) {
      setDailyRate(initialData.dailyRate.toString());
    }
    if (initialData?.depositAmount) {
      setDepositAmount(initialData.depositAmount.toString());
    }
    if (initialData?.methodPayment) {
      setMethodPayment(initialData.methodPayment);
    } 
  }, [initialData]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        dailyRate: dailyRate ? parseInt(dailyRate.replace(/\./g, ""), 10) : 0,
        depositAmount: depositAmount ? parseInt(depositAmount.replace(/\./g, ""), 10) : 0,
        methodPayment,
      });
    }
  }, [dailyRate, depositAmount, methodPayment, onDataChange]);

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
          <CurrencyInput
            id="dailyRate"
            name="dailyRate"
            label="Daily Rate"
            placeholder="0"
            value={dailyRate}
            onChange={setDailyRate}
            error={error?.dailyRate}
          />
          <p className="text-[10px] text-slate-500 italic">
            *Auto-filled from vehicle data
          </p>
        </div>
        <div className="space-y-2">
          <CurrencyInput
            id="depositAmount"
            name="depositAmount"
            label="Deposit Amount"
            placeholder="0"
            value={depositAmount}
            onChange={setDepositAmount}
            error={error?.depositAmount}
          />
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
