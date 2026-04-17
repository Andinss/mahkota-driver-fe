"use client";

import { PaymentCard } from "@/components/finance/payment-list/card";
import { PaymentTable } from "@/components/finance/payment-list/payment-table";
import { PageHeader } from "@/components/page-header";
import { FiltersSearch } from "@/components/rent/dashboard/filters-search";

export default function PaymentList() {
  const paymentsData = [
    {
      invoiceId: "#INV-4023",
      customer: { name: "James Anderson", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcgquo3s1Gm9UWljE7Yx8CgDUShF68J6fkgw1QvJ5OY4Yi2YzBIR_mdrI8wMWujABWw_8vsHbygbpYbgqBM5o6LBdaJNvGR8cQS8Loj8VvD3G18m5AUrXkuEbRUFb0n2zJFsSZxH5ROqS9ReASBv8Z79k6f6jw6z5dQr37SpsRhKvVgrzA5Oi0_54ygMxCPhm31EX4bMSnxf4i1OggQBnvb8Q3cZ6XmBTkAoo-PacjlfHNUo2yx-p-rIQHrGzFcM8KDdC3f0yGWk0q" },
      vehicle: { plate: "B 1234 CD" }, amount: "$450.00", dueDate: "Oct 24, 2023", status: "Late" as const, method: "Credit Card",
    },
    {
      invoiceId: "#INV-4024",
      customer: { name: "Sarah Connor", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyfv7iIobUo0yuS3OZSQpcwA_Q4P6OEp2BEv6Bwbfp5QdycOcW7dDrS_hRancDVUPPRaQKAJrwLOyxoV37O58AKHH0OHUX0RKiGjTpkOO_Fw89UQZGeSixjgPyTP0zqaGppeRd-jhD5sLc68crgFtEIOhQ2Nn4n8z7MwG0PJYnaqRpECVNooa_bCz7gY61QwZtkisx13u-gb-0t8A7slICPMoKqD6hBs_HMRMHG_bLDfwToOpWm8WmFhtJuwirFjrquGGHdcAHzCu-" },
      vehicle: { plate: "D 5678 XY" }, amount: "$1,200.00", dueDate: "Oct 26, 2023", status: "Pending Review" as const, method: "Bank Transfer",
    },
    {
      invoiceId: "#INV-4022",
      customer: { name: "Michael Chen", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4-mRZKk3sqc11M4-sgdg-mZ9I5zyhANPAmdKmeqj7Iw5Q18dIJsIrBrF_d3HIegqAQF3CVoWTLy9B3LiaKdX2AvWyLFPmmX5ZTxAUwqH8rxIO-Gq3dBmsb4rThS8lQfTfZr0gs82-lWf4XIUr4H-B4ewbtq8_wcz-AueRROyj6MaLydH7bffTSjJFW95b81j9f0kKQh7UDd0NUgIhq7b-gK4s4JiOJ4Fph6tXyN8PnpssPowxaTHEOORPGbR65EN2OuzGgASXQXOm" },
      vehicle: { plate: "B 9988 AA" }, amount: "$320.00", dueDate: "Oct 26, 2023", status: "Paid" as const, method: "Credit Card",
    },
    {
      invoiceId: "#INV-4025",
      customer: { name: "Emma Watson", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6QO9PL8jNr1d60A9pOnhJXK_msEq2QVp9QrkI9JKgiMRzewJp7yECe9-d3SWRWyTzkDZ3nXlb9SuQYKG19H1dutrDHNP6iazRBH4uaveVN0RxYwum0l6Ul5ah1HTYv-f56lFYn6JJmnXXobYEf6ueTww7FCQXfyF1jiIWRT910Q3xkk-m2xy2zsxZCu_YiDS008JPEAyzqmbm27ubUfYG6AAQSbggNbmI5MFc358Wiq_Kr2DnRFz6SIiefnhSYaTuDJzaHLe1wf-m" },
      vehicle: { plate: "F 2233 KL" }, amount: "$850.00", dueDate: "Oct 26, 2023", status: "Pending Review" as const, method: "Cash",
    },
    {
      invoiceId: "#INV-4021",
      customer: { name: "Robert Fox", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi1kPQgCgdKaBias77134VvG-U5cHjmNvAkyjUxDQND6pcV1Tl2ewWUXIVrAQkt_IDqUWWkt17S2Tgb0VpatU3NLXeUS9Uw3sH3Eo7rt3e0IoDm15GHyBthB0U6OYS9L_6V5kHzz_TbsbdgJ7TOcwYVHEZgr4SRoUagMxckIfOHdPNyuZvfnl6SGm_hi2ltiFvt4kStP8sCBx8Axb-4Y1QWdeYCaiQJdJKpwYX1S2x6HvIT8ReGDBhLAM12kql2fvOt1xIPUP_EyeB" },
      vehicle: { plate: "A 5544 BC" }, amount: "$150.00", dueDate: "Oct 25, 2023", status: "Paid" as const, method: "Credit Card",
    },
    {
      invoiceId: "#INV-4026",
      customer: { name: "Alice Johnson" },
      vehicle: { plate: "B 1111 EF" }, amount: "$670.00", dueDate: "Oct 27, 2023", status: "Late" as const, method: "Transfer",
    },
    {
      invoiceId: "#INV-4027",
      customer: { name: "Bob Smith" },
      vehicle: { plate: "D 2222 GH" }, amount: "$990.00", dueDate: "Oct 27, 2023", status: "Paid" as const, method: "Cash",
    },
    {
      invoiceId: "#INV-4028",
      customer: { name: "Carol White" },
      vehicle: { plate: "F 3333 IJ" }, amount: "$1,100.00", dueDate: "Oct 28, 2023", status: "Pending Review" as const, method: "QRIS",
    },
    {
      invoiceId: "#INV-4029",
      customer: { name: "David Brown" },
      vehicle: { plate: "G 4444 KL" }, amount: "$2,300.00", dueDate: "Oct 28, 2023", status: "Paid" as const, method: "Transfer",
    },
    {
      invoiceId: "#INV-4030",
      customer: { name: "Eva Martinez" },
      vehicle: { plate: "H 5555 MN" }, amount: "$780.00", dueDate: "Oct 29, 2023", status: "Late" as const, method: "Credit Card",
    },
    {
      invoiceId: "#INV-4031",
      customer: { name: "Frank Lee" },
      vehicle: { plate: "B 6666 OP" }, amount: "$430.00", dueDate: "Oct 29, 2023", status: "Paid" as const, method: "Cash",
    },
    {
      invoiceId: "#INV-4032",
      customer: { name: "Grace Kim" },
      vehicle: { plate: "D 7777 QR" }, amount: "$1,500.00", dueDate: "Oct 30, 2023", status: "Pending Review" as const, method: "Transfer",
    },
  ];

  const handleValidate = (payment: any) => console.log('Validate:', payment);
  const handleDetails = (payment: any) => console.log('Details:', payment);
  const handleDownload = (payment: any) => console.log('Download:', payment);
  const handleEdit = (payment: any) => console.log('Edit:', payment);
  const handleDelete = (payment: any) => console.log('Delete:', payment);
  const handleSearch = (value: string) => console.log('Search:', value);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">

    <PageHeader
                      title="Finance Dashboard"
                      description="Daily Payment Queue • October 26, 2023"
                      buttonText="Manual Entry"
                      buttonHref="/dashboard/finance/payment"
                    />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PaymentCard title="Total Collections Today" value="$12,450" icon="payments" iconColor="text-primary"
            trend={{ icon: "trending_up", value: "+12%", trendColor: "text-[#078838]", bgColor: "bg-green-100 dark:bg-green-900/30" }} />
          <PaymentCard title="Pending Payments" value="8" icon="pending_actions" iconColor="text-[#d97706]"
            trend={{ icon: "trending_up", value: "+2%", trendColor: "text-[#d97706]", bgColor: "bg-orange-100 dark:bg-orange-900/30" }} />
          <PaymentCard title="Overdue Amount" value="$3,200" icon="warning" iconColor="text-[#e73908]"
            trend={{ icon: "trending_down", value: "-5%", trendColor: "text-[#e73908]", bgColor: "bg-red-100 dark:bg-red-900/30" }} />
          <PaymentCard title="Validated Transactions" value="45" icon="verified" iconColor="text-[#078838]"
            trend={{ icon: "trending_up", value: "+8%", trendColor: "text-[#078838]", bgColor: "bg-green-100 dark:bg-green-900/30" }} />
        </div>

          <FiltersSearch/>
        <div className="flex flex-col gap-4 bg-surface-light dark:bg-surface-dark border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <PaymentTable
            payment={paymentsData}
            onValidate={handleValidate}
            onDetails={handleDetails}
            onDownload={handleDownload}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      
    </div>
  );
}