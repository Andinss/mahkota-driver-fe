"use client";

import { PageHeader } from "@/components/page-header";
import { RentalCard } from "@/components/rent/dashboard/card";
import { FiltersSearch } from "@/components/rent/dashboard/filters-search";
import { RentalTable } from "@/components/rent/dashboard/rent-table";


export default function RentalManagementPage() {
const rentalsData = [
  {
    transactionId: "#RT-4022",
    driver: {
      name: "Marco Polo",
      id: "889201",
      avatar: "https://i.pravatar.cc/40?img=1"
    },
    vehicle: {
      name: "Toyota Avanza",
      id: "B 1234 XYZ"
    },
    rentalPeriod: {
      start: "Oct 12",
      end: "Oct 15",
      duration: 3
    },
    deposit: "held",
    paymentStatus: "paid"
  },
  {
    transactionId: "#RT-4023",
    driver: {
      name: "Sarah Smith",
      id: "889205",
      avatar: "https://i.pravatar.cc/40?img=2"
    },
    vehicle: {
      name: "Honda CR-V",
      id: "B 5678 ABC"
    },
    rentalPeriod: {
      start: "Oct 14",
      end: "Oct 20",
      duration: 6
    },
    deposit: "pending",
    paymentStatus: "partial"
  },
  {
    transactionId: "#RT-4024",
    driver: {
      name: "Robert Chen",
      id: "889312",
      avatar: "https://i.pravatar.cc/40?img=3"
    },
    vehicle: {
      name: "Mitsubishi Pajero",
      id: "B 9910 DEF"
    },
    rentalPeriod: {
      start: "Oct 01",
      end: "Oct 10",
      duration: 9
    },
    deposit: "held",
    paymentStatus: "late"
  },
  {
    transactionId: "#RT-4025",
    driver: {
      name: "Anita Wijaya",
      id: "889410",
      avatar: "https://i.pravatar.cc/40?img=4"
    },
    vehicle: {
      name: "Toyota Innova",
      id: "B 2233 GHI"
    },
    rentalPeriod: {
      start: "Oct 15",
      end: "Oct 16",
      duration: 1
    },
    deposit: "waiting",
    paymentStatus: "unpaid"
  }
];

  return (
    <div className="p-8 space-y-8">
        <PageHeader
                  title="Rentals List Overview"
                  description="Monitor active rentals, handle pending and late payments, and review daily completed transactions."
                  buttonText="Add New Rentals"
                  buttonHref="/dashboard/rent/new"
                />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <RentalCard
        title="Active Rentals"
            value="142"
            icon="key"
            iconColor="text-primary"
            trend={{
              value: "+5% from last month",
              color: "text-green-600",
              icon: "trending_up",
            }}
        />

        <RentalCard
        title="Pending Payments"
            value="28"
            icon="pending_actions"
            iconColor="text-amber-600"
            trend={{
              value: "-2% from last week",
              color: "text-rose-600",
              icon: "trending_down",
            }}
        />

        <RentalCard
        title="Late Payments"
            value="12"
            icon="error"
            iconColor="text-rose-600"
            trend={{
              value: "+8% priority",
              color: "text-green-600",
              icon: "trending_up",
            }}
        />

        <RentalCard
        title="Completed Today"
            value="45"
            icon="task_alt"
            iconColor="text-emerald-600"
            trend={{
              value: "-4% daily goal",
              color: "text-rose-600",
              icon: "trending_down",
            }}
        />

      </div>

        <FiltersSearch/>
        <RentalTable rentals={rentalsData} />
    </div>
  );
}
