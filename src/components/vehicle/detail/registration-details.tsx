interface RegistrationItem {
  label: string;
  value: string;
}

interface RegistrationDetailsProps {
  details: RegistrationItem[];
}

export function RegistrationDetails({ details }: RegistrationDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#111418] dark:text-white font-bold text-base flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          description
        </span>
        Registration Details
      </h3>
      <div className="space-y-3">
        {details.map((detail, index) => (
          <div
            key={index}
            className="flex justify-between border-b border-[#f0f2f4] pb-2"
          >
            <span className="text-[#617589] text-sm">{detail.label}</span>
            <span className="text-[#111418] dark:text-white text-sm font-semibold">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
