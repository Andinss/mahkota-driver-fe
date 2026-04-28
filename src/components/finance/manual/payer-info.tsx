"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { SearchInputWithClear } from "@/components/ui/search-input-with-clear";


// Mock Data Driver
const mockDrivers = [
  { 
    id: "DRV-8822", 
    name: "Sarah Connor", 
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyfv7iIobUo0yuS3OZSQpcwA_Q4P6OEp2BEv6Bwbfp5QdycOcW7dDrS_hRancDVUPPRaQKAJrwLOyxoV37O58AKHH0OHUX0RKiGjTpkOO_Fw89UQZGeSixjgPyTP0zqaGppeRd-jhD5sLc68crgFtEIOhQ2Nn4n8z7MwG0PJYnaqRpECVNooa_bCz7gY61QwZtkisx13u-gb-0t8A7slICPMoKqD6hBs_HMRMHG_bLDfwToOpWm8WmFhtJuwirFjrquGGHdcAHzCu-", 
    balance: -1200 
  },
  { 
    id: "DRV-8823", 
    name: "Emma Watson", 
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6QO9PL8jNr1d60A9pOnhJXK_msEq2QVp9QrkI9JKgiMRzewJp7yECe9-d3SWRWyTzkDZ3nXlb9SuQYKG19H1dutrDHNP6iazRBH4uaveVN0RxYwum0l6Ul5ah1HTYv-f56lFYn6JJmnXXobYEf6ueTww7FCQXfyF1jiIWRT910Q3xkk-m2xy2zsxZCu_YiDS008JPEAyzqmbm27ubUfYG6AAQSbggNbmI5MFc358Wiq_Kr2DnRFz6SIiefnhSYaTuDJzaHLe1wf-m", 
    balance: -850 
  },
  { 
    id: "DRV-8824", 
    name: "Michael Chen", 
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4-mRZKk3sqc11M4-sgdg-mZ9I5zyhANPAmdKmeqj7Iw5Q18dIJsIrBrF_d3HIegqAQF3CVoWTLy9B3LiaKdX2AvWyLFPmmX5ZTxAUwqH8rxIO-Gq3dBmsb4rThS8lQfTfZr0gs82-lWf4XIUr4H-B4ewbtq8_wcz-AueRROyj6MaLydH7bffTSjJFW95b81j9f0kKQh7UDd0NUgIhq7b-gK4s4JiOJ4Fph6tXyN8PnpssPowxaTHEOORPGbR65EN2OuzGgASXQXOm", 
    balance: -320 
  },
  { 
    id: "DRV-8825", 
    name: "James Anderson", 
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcgquo3s1Gm9UWljE7Yx8CgDUShF68J6fkgw1QvJ5OY4Yi2YzBIR_mdrI8wMWujABWw_8vsHbygbpYbgqBM5o6LBdaJNvGR8cQS8Loj8VvD3G18m5AUrXkuEbRUFb0n2zJFsSZxH5ROqS9ReASBv8Z79k6f6jw6z5dQr37SpsRhKvVgrzA5Oi0_54ygMxCPhm31EX4bMSnxf4i1OggQBnvb8Q3cZ6XmBTkAoo-PacjlfHNUo2yx-p-rIQHrGzFcM8KDdC3f0yGWk0q", 
    balance: -450 
  },
  { 
    id: "DRV-8826", 
    name: "Robert Fox", 
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi1kPQgCgdKaBias77134VvG-U5cHjmNvAkyjUxDQND6pcV1Tl2ewWUXIVrAQkt_IDqUWWkt17S2Tgb0VpatU3NLXeUS9Uw3sH3Eo7rt3e0IoDm15GHyBthB0U6OYS9L_6V5kHzz_TbsbdgJ7TOcwYVHEZgr4SRoUagMxckIfOHdPNyuZvfnl6SGm_hi2ltiFvt4kStP8sCBx8Axb-4Y1QWdeYCaiQJdJKpwYX1S2x6HvIT8ReGDBhLAM12kql2fvOt1xIPUP_EyeB", 
    balance: -150 
  },
  { 
    id: "DRV-8831", 
    name: "Frank Lee", 
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcgquo3s1Gm9UWljE7Yx8CgDUShF68J6fkgw1QvJ5OY4Yi2YzBIR_mdrI8wMWujABWw_8vsHbygbpYbgqBM5o6LBdaJNvGR8cQS8Loj8VvD3G18m5AUrXkuEbRUFb0n2zJFsSZxH5ROqS9ReASBv8Z79k6f6jw6z5dQr37SpsRhKvVgrzA5Oi0_54ygMxCPhm31EX4bMSnxf4i1OggQBnvb8Q3cZ6XmBTkAoo-PacjlfHNUo2yx-p-rIQHrGzFcM8KDdC3f0yGWk0q", 
    balance: -430 
  },
  { 
    id: "DRV-8832", 
    name: "Grace Kim", 
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyfv7iIobUo0yuS3OZSQpcwA_Q4P6OEp2BEv6Bwbfp5QdycOcW7dDrS_hRancDVUPPRaQKAJrwLOyxoV37O58AKHH0OHUX0RKiGjTpkOO_Fw89UQZGeSixjgPyTP0zqaGppeRd-jhD5sLc68crgFtEIOhQ2Nn4n8z7MwG0PJYnaqRpECVNooa_bCz7gY61QwZtkisx13u-gb-0t8A7slICPMoKqD6hBs_HMRMHG_bLDfwToOpWm8WmFhtJuwirFjrquGGHdcAHzCu-", 
    balance: -1500 
  },
];

interface PayerInfoProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onPayerSelect?: (name: string, id: string) => void;
  selectedPayerId?: string; 
}

const PayerInfo = ({ 
  searchValue = "", 
  onSearchChange,
  onPayerSelect,
  selectedPayerId 
}: PayerInfoProps) => {
  const [filteredDrivers, setFilteredDrivers] = useState(mockDrivers);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<typeof mockDrivers[0] | null>(null);

  useEffect(() => {
    if (searchValue) {
      const filtered = mockDrivers.filter(driver =>
        driver.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        driver.id.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredDrivers(filtered);
      setShowDropdown(true);
    } else {
      setFilteredDrivers(mockDrivers);
      setShowDropdown(false);
    }
  }, [searchValue]);

  // TAMBAHKAN INI (Load selected driver when editing)
  useEffect(() => {
    if (selectedPayerId) {
      const driver = mockDrivers.find(d => d.id === selectedPayerId);
      if (driver) {
        setSelectedDriver(driver);
        onSearchChange?.(driver.name);
      }
    }
  }, [selectedPayerId]);

  // TAMBAHKAN INI (Handle driver selection)
  const handleSelectDriver = (driver: typeof mockDrivers[0]) => {
    setSelectedDriver(driver);
    onSearchChange?.(driver.name);
    onPayerSelect?.(driver.name, driver.id);
    setShowDropdown(false);
  };
  return (
    <Card className="rounded-xl bg-white dark:bg-[#1e2732] border border-[#e5e7eb] dark:border-gray-800 shadow-sm p-6">
      <h3 className="text-base font-semibold text-[#111418] dark:text-white mb-4">
        Payer Information
      </h3>
      <div className="relative mb-6">
      <SearchInputWithClear
        placeholder="Search Driver ID or Name..."
        className="mb-6"
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        onClear={() => {
            onSearchChange?.("");
            setSelectedDriver(null);
            onPayerSelect?.("", "");
          }}
      />

       {showDropdown && filteredDrivers.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-100 dark:border-slate-700 last:border-0"
                onClick={() => handleSelectDriver(driver)}
              >
                <Avatar
                  src={driver.avatar}
                  alt={driver.name}
                  size="md"
                  className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 bg-center bg-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#111418] dark:text-white">{driver.name}</p>
                  <p className="text-xs text-[#617589] dark:text-gray-400">ID: {driver.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#617589] dark:text-gray-400">Balance</p>
                  <p className={`text-sm font-bold ${driver.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {driver.balance < 0 ? `-$${Math.abs(driver.balance)}` : `$${driver.balance}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UBAH INI - Tampilkan driver yang dipilih */}
      {selectedDriver && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20 dark:bg-primary/10 dark:border-primary/30 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              src={selectedDriver.avatar}
              alt={selectedDriver.name}
              size="lg"
              className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 bg-center bg-cover"
            />
            <div>
              <h4 className="text-base font-bold text-[#111418] dark:text-white">
                {selectedDriver.name}
              </h4>
              <p className="text-sm text-[#617589] dark:text-gray-400">
                ID: <span className="font-mono text-[#111418] dark:text-gray-200">{selectedDriver.id}</span> • Active
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end min-w-[120px]">
            <span className="text-xs text-[#617589] dark:text-gray-400 uppercase tracking-wide">
              Current Balance
            </span>
            <span className={`text-lg font-bold ${selectedDriver.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600'}`}>
              {selectedDriver.balance < 0 ? `-$${Math.abs(selectedDriver.balance)}` : `$${selectedDriver.balance}`}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PayerInfo;
