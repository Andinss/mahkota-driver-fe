interface SpecItem {
  label: string;
  value: string;
}

interface TechnicalSpecsProps {
  specs: SpecItem[];
}

export function TechnicalSpecs({ specs }: TechnicalSpecsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#111418] dark:text-white font-bold text-base flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          manufacturing
        </span>
        Technical Specifications
      </h3>
      <div className="space-y-3">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="flex justify-between border-b border-[#f0f2f4] pb-2"
          >
            <span className="text-[#617589] text-sm">{spec.label}</span>
            <span className="text-[#111418] dark:text-white text-sm font-semibold">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
