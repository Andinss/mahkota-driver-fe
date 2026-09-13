export interface HistorySetoran {
  id: string;
  payment_date: string;
  reference_number: string;
  payment_method: "cash" | "transfer" | "e-wallet" | "saldo";
  amount_received: number;
  finance_type: "paid" | "unpaid" | "pending" | "partially_paid" | "cancelled";
  notes?: string;
  rental_number?: string;
}