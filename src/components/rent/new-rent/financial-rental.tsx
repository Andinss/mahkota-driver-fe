"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { Select } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { saldoApi } from "@/lib/api/saldo";

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
    saldoSufficient?: boolean;
   }) => void;
  onRentalTypeChange?: (data: {
    rentalDuration?: string;
    rentalService?: string;
  }) => void;
  initialData?: {
    dailyRate?: number;
    depositAmount?: number;
    methodPayment?: string;
    driverId?: string;
    totalRevenue?: number;
    rentalDuration?: string;
    rentalService?: string;
  }
  error?: FormErrors;
} 
 

const parseCurrency = (val: string) => val ? parseInt(val.replace(/\./g, ""), 10) : 0;

const FinancialRental = ({ onDataChange, onRentalTypeChange, initialData, error }: FinancialRentalProps) => {
  const initRate = initialData?.dailyRate ? initialData.dailyRate.toString() : "";
  const initDeposit = initialData?.depositAmount ? initialData.depositAmount.toString() : "";
  const [dailyRate, setDailyRate] = useState<string>(initRate);
  const [depositAmount, setDepositAmount] = useState<string>(initDeposit);
  const [methodPayment, setMethodPayment] = useState<string>(initialData?.methodPayment || "Bank");
  const [rentalDuration, setRentalDuration] = useState<string>(initialData?.rentalDuration || "");
  const [rentalService, setRentalService] = useState<string>(initialData?.rentalService || "");
  const [saldoBalance, setSaldoBalance] = useState<number | null>(null);
  const [loadingSaldo, setLoadingSaldo] = useState(false);

  useEffect(() => {
    if (methodPayment === "Saldo" && initialData?.driverId) {
      setLoadingSaldo(true);
      saldoApi.getBalance(initialData.driverId)
        .then((res) => {
          const data = (res as any)?.data;
          const balance = data?.balance ?? 0;
          setSaldoBalance(balance);
          const totalRevenue = initialData?.totalRevenue || 0;
          const sufficient = totalRevenue > 0 ? balance >= totalRevenue : true;
          onDataChange?.({
            dailyRate: parseCurrency(dailyRate),
            depositAmount: parseCurrency(depositAmount),
            methodPayment,
            saldoSufficient: sufficient,
          });
        })
        .catch(() => {
          setSaldoBalance(0);
          onDataChange?.({
            dailyRate: parseCurrency(dailyRate),
            depositAmount: parseCurrency(depositAmount),
            methodPayment,
            saldoSufficient: false,
          });
        })
        .finally(() => {
          setLoadingSaldo(false);
        });
    }
  }, [methodPayment, initialData?.driverId, initialData?.totalRevenue]);

  const handleDailyRateChange = (val: string) => {
    setDailyRate(val);
    onDataChange?.({
      dailyRate: parseCurrency(val),
      depositAmount: parseCurrency(depositAmount),
      methodPayment,
    });
  };

  const handleDepositChange = (val: string) => {
    setDepositAmount(val);
    onDataChange?.({
      dailyRate: parseCurrency(dailyRate),
      depositAmount: parseCurrency(val),
      methodPayment,
    });
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setMethodPayment(val);
    if (val === "Saldo" && saldoBalance !== null) {
      const totalRevenue = initialData?.totalRevenue || 0;
      const sufficient = totalRevenue > 0 ? saldoBalance >= totalRevenue : true;
      onDataChange?.({
        dailyRate: parseCurrency(dailyRate),
        depositAmount: parseCurrency(depositAmount),
        methodPayment: val,
        saldoSufficient: sufficient,
      });
    } else {
      onDataChange?.({
        dailyRate: parseCurrency(dailyRate),
        depositAmount: parseCurrency(depositAmount),
        methodPayment: val,
        saldoSufficient: true,
      });
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRentalDuration(val);
    onRentalTypeChange?.({
      rentalDuration: val,
      rentalService,
    });
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRentalService(val);
    onRentalTypeChange?.({
      rentalDuration,
      rentalService: val,
    });
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
          <div>
            <Select
              id="rentalDuration"
              name="rentalDuration"
              label="Tipe Durasi"
              value={rentalDuration}
              onChange={handleDurationChange}
            >
              <option value="">Pilih Durasi</option>
              <option value="harian">Harian</option>
              <option value="mingguan">Mingguan</option>
              <option value="bulanan">Bulanan</option>
              <option value="tahunan">Tahunan</option>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <Select
              id="rentalService"
              name="rentalService"
              label="Jenis Layanan"
              value={rentalService}
              onChange={handleServiceChange}
            >
              <option value="">Pilih Layanan</option>
              <option value="lepas kunci">Lepas Kunci</option>
              <option value="pakai supir">Pakai Supir</option>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <CurrencyInput
            id="dailyRate"
            name="dailyRate"
            label="Daily Rate"
            placeholder="0"
            value={dailyRate}
            onChange={handleDailyRateChange}
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
            onChange={handleDepositChange}
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
              onChange={handleMethodChange}
            >
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
              <option value="E Wallet">E Wallet</option>
              <option value="Saldo">Saldo (Bayar dari Saldo Driver)</option>
            </Select>
          </div>
          {methodPayment === "Saldo" && (
            <div className={`p-3 rounded-lg border ${
              saldoBalance !== null && saldoBalance > 0
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}>
              {loadingSaldo ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">Memuat saldo...</p>
              ) : (
                <>
                  <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Saldo Driver
                  </p>
                  <p className={`text-sm font-bold ${
                    saldoBalance !== null && saldoBalance > 0
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}>
                    Rp {Number(saldoBalance ?? 0).toLocaleString("id-ID")}
                  </p>
                  {saldoBalance !== null && saldoBalance <= 0 && (
                    <p className="text-[10px] text-red-600 dark:text-red-400 mt-1">
                      Saldo tidak mencukupi untuk pembayaran
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinancialRental;
