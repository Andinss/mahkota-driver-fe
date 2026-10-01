interface RentalPricingProps {
  baseRate: string;
  costPrice?: string;
}

export function RentalPricing({ baseRate, costPrice }: RentalPricingProps) {
  const parseRupiah = (str?: string) => {
    if (!str) return 0;
    return Number(str.replace(/[^\d]/g, "")) || 0;
  };

  const cost = parseRupiah(costPrice);
  const rate = parseRupiah(baseRate);
  const margin = rate - cost;
  const marginPct = cost > 0 ? ((margin / cost) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-4">
      <h3 className="text-[#111418] dark:text-white font-bold text-base flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          monetization_on
        </span>
        Rental Pricing
      </h3>
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
        {/* Cost Price */}
        {costPrice && (
          <>
            <div className="flex items-center justify-between py-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                Cost Price
              </span>
              <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                {costPrice}
              </span>
            </div>
            <div className="border-t border-primary/10" />
          </>
        )}

        {/* Base Rate */}
        <div className="flex items-center justify-between py-3">
          <span className="text-xs text-primary font-bold uppercase tracking-widest">
            Base Rate
          </span>
          <span className="text-base font-bold text-[#111418] dark:text-white">
            {baseRate}{" "}
            <span className="text-xs font-normal text-[#617589]">/ day</span>
          </span>
        </div>

        {/* Margin */}
        {cost > 0 && rate > 0 && (
          <>
            <div className="border-t border-primary/10" />
            <div className="flex items-center justify-between py-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                Margin
              </span>
              <span className={`text-base font-bold ${margin >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                Rp {Math.abs(margin).toLocaleString("id-ID")} ({marginPct}%)
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}