interface PricingFeature {
  text: string;
}

interface RentalPricingProps {
  baseRate: string;
  features: PricingFeature[];
}

export function RentalPricing({ baseRate, features }: RentalPricingProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#111418] dark:text-white font-bold text-base flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          monetization_on
        </span>
        Rental Pricing
      </h3>
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
        <div className="mb-4">
          <span className="text-xs text-primary font-bold uppercase tracking-widest">
            Base Rate
          </span>
          <p className="text-2xl font-bold text-[#111418] dark:text-white">
            {baseRate}{" "}
            <span className="text-sm font-normal text-[#617589]">/ day</span>
          </p>
        </div>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-[#111418] dark:text-white">
              <span className="material-symbols-outlined text-green-500 text-lg">
                check_circle
              </span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
