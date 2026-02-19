"use client";

import { Breadcrumbs } from "@/components/vehicle/management/breadcrumbs";
import { PageHeader } from "@/components/vehicle/management/page-header";
import { HistorySearchFilters } from "@/components/vehicle/history/history-search-filters";
import { HistoryTable } from "@/components/vehicle/history/history-table";

const VehicleHistory = () => {
  const histories = [
    {
      vehicle: {
        name: "Toyota Fortuner",
        plate: "B 1293 KJL",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCvc__uZxohdwGBGRSwA9mT0UcoMJ9V3-p1VMdQVUFldGpJKZMNQKjdJdp5ioiOB6eFPofo6fr-WG03gIwXT59YtzHyWvabhznSkwMdRgNEO3VVU1dLQq1-W4alr6orM155vHnEP-LSDWlH6Lg_cR4C7ZcLDzIitG2PxfeOG0tyjrvbj1T-f6LFweRoLOVdbWvpmDRKxh5m9jHQp0-elZCSTRF00700Oahjhu0-0nDB55lsqE-xXxy2xrMIcrdxh0Y4UdVo-G7iNpH4",
        imageAlt: "White SUV side view",
      },
      driver: {
        name: "Budi Santoso",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuABsjtPKm9Y_orF3rdxXYH6ubOZ6BMP5Yn8MdIC0YjIfN90dSCLfq7iIvCqMlo9QQLf5RfGVJjdjd2Y5Fjq-SW1O54bwbXpN4lL2CcQrH_DVynm0cW9xUQvs-6CxGGYmH-zny8Ggmz4kptCghTHFWHc85JEmmJvhSnQ2kJsptWIy37j8vHo-zKcGxBVEv7LZSVsWvc8DiQc8-rJvJeyPJvnIrQM1K6yi01RN1nBxJFtkZa6jpHuvGP6MvtWzm9XbdAiCwSM_1YQe2v1",
        imageAlt: "Portrait of driver Budi",
      },
      startDate: "Oct 12, 2023",
      endDate: "Oct 15, 2023",
      duration: "3 Days",
      paymentStatus: "paid" as const,
    },
    {
      vehicle: {
        name: "Honda Civic",
        plate: "B 8822 OP",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCIqAHXlSnS7gXJGSqmllMAQCtrwYtj_gCXShGdy0Xmv3-igzrK73JBp4vlDcurMk-5czeog8R5G-TRGgCyzIK60H7Vw_Klqq0VIM2JG0r4wme8aVbtH9PLyPpYJiKRYLgnpgkPcxse61qlNmHi2waKiVCsK8shY6H2i7Nc9ZeoNRAexOOVmqmJIZaRdG3MBT0iO5YOB9aRu9YQ9aYmNUe33ZPnkszU8E7l6CKYwO5R7dkhOCG7epNDKpW_38Vuz7GDRtBwE2tIfiHM",
        imageAlt: "Black Sedan front view",
      },
      driver: {
        name: "Sarah Wijaya",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBjm2Nl82L-8FGFsQTuHMIGYQlgq-6MtCScZukuuS62UjmCj7eyhs1woEPFuL9aWJzDPsGqJ37fe7VZhfdNaYyrrFbjO_OstW7zFMFdN-WvGS7uHLSEx_PxzGXP3bDNArvtkiz12aLLpV3RaIv7lIHIJlU8CyhhuW55uoy6KrwHMnCAI8xWUsgCYqX1J4-NpWeXd1ngICEhaMOP3vSPAfQFaEDL31EdUnH912BwpaeKyYnNu78ztspNhWCtS6H0J37tm7DzXqqnHBI0",
        imageAlt: "Portrait of driver Sarah",
      },
      startDate: "Oct 10, 2023",
      endDate: "Oct 14, 2023",
      duration: "4 Days",
      paymentStatus: "pending" as const,
      maintenance: {
        hasMaintenance: true,
        note: "Oil Change (Oct 11)",
      },
    },
    {
      vehicle: {
        name: "Daihatsu Xenia",
        plate: "B 4561 SS",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBg6F4ThxL7-Wd-BxN9TS-jnS5mXksNl0BYQOjJyY8ZZGuF_uCuBxXB4XQydFdFiXq3ocHV5gXIxamZlrrknyeADW3HtC7hidtHCJoCWV0TqIvGD2RVcJ8xmzpOjLXAALobeS_7seBX2Bp2pVBUzfLyPUcDsIaurtF62ZbZJLh3e0kONA5gM16eAd1eHWZpjLJSl_rfmopJhdHbEgpFNO1PuuJSWmqmmqlnkU-Pkx1l28xiIdqQrtzRgtC_fcaC2e8SCcankuFyihDA",
        imageAlt: "Silver MPV side view",
      },
      driver: {
        name: "Ahmad Fauzi",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCB6CnrbeTBP2AEgLCul5zA9LRMIpT3HqaITNxZ22tV4NnHtIbWlLX30MnUhygImLhlWPnm8rH2my_T12AZk3dOncwilmBqgj5GFAhEdsl-OHGPBwfPuOiwYygZPTX7p9bHmNwxH2hNVWdfZfoenCfAMpxuwIDUGZ1DyPCu5v2f5nNNKJitZv_wRk1RD_shN6xTSEtnJFQp-_X9R0_nZneR3fS-63EBDglJbIqO0121a1ltKK_QIO6BtfqOnjI4DBmU8rlv10Mdx5nM",
        imageAlt: "Portrait of driver Ahmad",
      },
      startDate: "Sep 28, 2023",
      endDate: "Oct 01, 2023",
      duration: "3 Days",
      paymentStatus: "paid" as const,
    },
    {
      vehicle: {
        name: "Toyota Yaris",
        plate: "B 9912 QR",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCoU6hYzm-rsrqjWDveYTKpTbHOxGxWaLla1GDhEIPJhJ27LRXinSECrwwo-hmTs1vvFeoc3k3h47VrfZq_OrK6QoBrysZpnSfbb3vC6r5H66mkq63FgG89JpH_waxzqPlmHZ7QuqPKj0FHHLp2va5Uo0HKFm-DY_miake3s20O38Ex2ckmshu6oSXH4cXE0newqelfYEDeW3ESKXX2NZEbVgwUaB-YEkR-XNvUxGAWy4Z_8HuPAeHn6AwNAXf4q7XEjcI0kTmzAeGO",
        imageAlt: "Blue Hatchback",
      },
      driver: {
        name: "Maria Tan",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBkL0uf9zc-noAi1ZKA5IF_PdNXZAfzDQLozD5Ij1V7mYXdQdW3XMkS2E1wJi9ACKYBHBzIyK5Ti76EYQnf9J5st1GOcORCIwoHuXEMl8YIWSxaPoBPCBCT2NY1XQMW-iQGMPRGvMYuViXv6NDrJ-CsrcjZLyK-ivCUv_bS-Ei23ffjkE6EFEaXxn2BUgbnvLCL-7cfhcGKucHvUBh83UKY-weRzzfEASvE9Sxn28GPw1t8clxqCrEc-kYu6z-jHOImembA9VJKAIJV",
        imageAlt: "Portrait of driver Maria",
      },
      startDate: "Sep 25, 2023",
      endDate: "Sep 27, 2023",
      duration: "2 Days",
      paymentStatus: "refunded" as const,
    },
    {
      vehicle: {
        name: "Pajero Sport",
        plate: "B 7734 ZX",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCjQ_mRh3usv4dWvCIsoDaLIZ_NTbppt56yDGnrbq1vL-I83VX2-eyYgBpJZFE1zenIGzpNNku6qLRLEob1vkenVuxQghqH744AsHLPHc8-k7McBPpSRA8LzSXE9RG-zF_om5J2lDFSY213wFaelhywir32K7WSjWljI745LViWatibs_7ycGjdjlxKCJEfalsHw9e2HroCyu25Jd9Urr612ut_Ah3_WGfo8gwe9CqUEYns_SD8pevegfangupMGEkNLmugBdOChXCX",
        imageAlt: "Luxury Black SUV",
      },
      driver: {
        name: "Alex Nugraha",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCo1IYZ22spumCGOacqvKVRG8vkd7m3UYtfuZW7Hnslz1sQrCuntJYl9FpjiT3TnoW1PJX6oEDbIu3SXqIalKuAMh7mCPfZXE4GNLbtmDob4hHTIjhdln7yAscImVqtR2R2w07jmnks2PNulRetExrXgtaPd2c7qgBsq4ID_wXTHukZknULR3zLGs9aZYJmzYTiGwH6lnHvSbFlzwYjNoQCrqZ1oVNOOZRiZZR4K1f_OGmJnHxGUnjcDLSbDij48dic6MyDlem8TAAI",
        imageAlt: "Portrait of driver Alex",
      },
      startDate: "Sep 20, 2023",
      endDate: "Sep 25, 2023",
      duration: "5 Days",
      paymentStatus: "paid" as const,
      maintenance: {
        hasMaintenance: true,
        note: "Tire Rotation (Sep 21)",
      },
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "#" },
            { label: "Vehicles", href: "/dashboard/vehicle" },
            { label: "History" },
          ]}
        />

        <PageHeader
          title="Vehicle Rental History"
          description="View detailed logs of vehicle usage, payments, and incidents."
          buttonText="Export Report"
        />

        <HistorySearchFilters />
        <HistoryTable histories={histories} />
      </div>
    </div>
  );
};

export default VehicleHistory;
