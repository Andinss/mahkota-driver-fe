export interface HistorySetoran {
  id: string;
  payment_date: string;
  reference_number: string;
  payment_method: "cash" | "transfer" | "e-wallet" | "saldo";
  amount_received: number;
  finance_type: "paid" | "unpaid" | "pending" | "cancelled";
  notes?: string;
  rental_number?: string;
  rental_id?: string;
}