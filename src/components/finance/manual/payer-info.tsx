import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { SearchInputWithClear } from "@/components/ui/search-input-with-clear";

interface PayerInfoProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const PayerInfo = ({ searchValue = "", onSearchChange }: PayerInfoProps) => {
  return (
    <Card className="rounded-xl bg-white dark:bg-[#1e2732] border border-[#e5e7eb] dark:border-gray-800 shadow-sm p-6">
      <h3 className="text-base font-semibold text-[#111418] dark:text-white mb-4">
        Payer Information
      </h3>
      <SearchInputWithClear
        placeholder="Search Driver ID or Name..."
        className="mb-6"
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        onClear={() => onSearchChange?.("")}
      />

      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20 dark:bg-primary/10 dark:border-primary/30 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-ZD-Nx265ECqN3m5G0TJt8QfVK-uvuj6UKNPkx972gErfg8_A9HkFtfsAlqQQbv72vD4bxp8sjrqOyJcNWbYTrpPKVkHxuvYvoe8bMS0yago44SgFyfjoKaktg53QKcfQMfK0e5eAGhrecTt4Olk0zNbLyUjaJJZS8DwcOGuN5nP-HKSAcMPO38zBSroDawXRZro2ZgdJD2mT2HL9baw8LhGDyzu9QnwdgneenBTMEVPLJhr6gzPD1sckDq5l5sW8lj0TI_U18cj6"
            alt="Portrait of driver John Doe"
            size="lg"
            className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 bg-center bg-cover"
          />
          <div>
            <h4 className="text-base font-bold text-[#111418] dark:text-white">
              John Doe
            </h4>
            <p className="text-sm text-[#617589] dark:text-gray-400">
              ID:{" "}
              <span className="font-mono text-[#111418] dark:text-gray-200">
                DRV-8821
              </span>{" "}
              • Active
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end min-w-[120px]">
          <span className="text-xs text-[#617589] dark:text-gray-400 uppercase tracking-wide">
            Current Balance
          </span>
          <span className="text-lg font-bold text-red-600 dark:text-red-400">
            -$200.00
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PayerInfo;
