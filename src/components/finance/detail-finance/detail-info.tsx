import type { FinanceItem } from "@/lib/types/finances";

const formatCurrency = (value: string) => {
  const num = parseFloat(value.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface DetailInfoProps {
  finance: FinanceItem;
}

const DetailInfo = ({ finance }: DetailInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-6">
          Payer Information
        </p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
            <span className="text-2xl font-bold text-gray-600">
              {finance.payer.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">{finance.payer}</h4>
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              Amount: {formatCurrency(finance.amount_received)}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-6">
          Payment Details
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Reference:</span>
            <span className="text-sm font-bold text-gray-900">{finance.reference_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Date:</span>
            <span className="text-sm font-bold text-gray-900">{formatDate(finance.payment_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Method:</span>
            <span className="text-sm font-bold text-gray-900 capitalize">{finance.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Notes:</span>
            <span className="text-sm text-gray-900">{finance.notes || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailInfo;
