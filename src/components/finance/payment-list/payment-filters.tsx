import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface PaymentFiltersProps {
  searchValue?: string;
  paymentMethod?: string;
  onSearchChange?: (value: string) => void;
  onPaymentMethodChange?: (value: string) => void;
}

export const PaymentFilters = ({
  searchValue = "",
  paymentMethod = "",
  onSearchChange,
  onPaymentMethodChange,
}: PaymentFiltersProps) => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          placeholder="Search Reference Number or Payer..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Select
            id="filter-method"
            label=""
            className="min-w-[140px]"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange?.(e.target.value)}
          >
            <option value="">Payment Method: All</option>
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
            <option value="e-wallet">E-Wallet</option>
            <option value="saldo">Saldo</option>
          </Select>
        </div>
      </div>
    </div>
  );
};
