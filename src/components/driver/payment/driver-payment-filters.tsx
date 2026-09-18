import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface DriverPaymentFiltersProps {
  searchValue?: string;
  status?: string;
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
}

export const DriverPaymentFilters = ({
  searchValue = "",
  status = "",
  onSearchChange,
  onStatusChange,
}: DriverPaymentFiltersProps) => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          placeholder="Cari No. Referensi, SPK, atau Deskripsi..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Select
            id="filter-status"
            label=""
            className="min-w-[140px]"
            value={status}
            onChange={(e) => onStatusChange?.(e.target.value)}
          >
            <option value="">Status: Semua</option>
            <option value="lunas">Lunas</option>
            <option value="pending">Menunggu Pembayaran</option>
            <option value="failed">Gagal</option>
          </Select>
        </div>
      </div>
    </div>
  );
};
