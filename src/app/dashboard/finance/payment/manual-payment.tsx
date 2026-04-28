"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PayerInfo from "@/components/finance/manual/payer-info";
import Summary from "@/components/finance/manual/summary";
import TransactionDetail from "@/components/finance/manual/transaction-detail";

// Mock data 
const mockPayments: Record<string, any> = {
  "INV-4022": {
    id: "INV-4022",
    payerName: "Michael Chen",
    payerId: "DRV-8824",  // buat ID driver baru
    amount: "$320.00",
    paymentDate: "2023-10-26",
    paymentMethod: "Credit Card",
    referenceNumber: "REF-20231026-002",
    notes: "Payment for rental invoice INV-4022",
    invoiceId: "#INV-4022",
    vehiclePlate: "B 9988 AA",
  },
  "INV-4023": {
    id: "INV-4023",
    payerName: "James Anderson",
    payerId: "DRV-8825",
    amount: "$450.00",
    paymentDate: "2023-10-24",
    paymentMethod: "Credit Card",
    referenceNumber: "REF-20231024-003",
    notes: "Payment for rental invoice INV-4023",
    invoiceId: "#INV-4023",
    vehiclePlate: "B 1234 CD",
  },
  "INV-4024": {
    id: "INV-4024",
    payerName: "Sarah Connor",
    payerId: "DRV-8822",
    amount: "$1,200.00",
    paymentDate: "2023-10-26",
    paymentMethod: "Transfer",
    referenceNumber: "TRF-20231026-001",
    notes: "Payment for rental invoice INV-4024",
    invoiceId: "#INV-4024",
    vehiclePlate: "D 5678 XY",
  },
  "INV-4025": {
    id: "INV-4025",
    payerName: "Emma Watson",
    payerId: "DRV-8823",
    amount: "$850.00",
    paymentDate: "2023-10-26",
    paymentMethod: "Cash",
    referenceNumber: "CSH-20231026-002",
    notes: "Payment for rental invoice INV-4025",
    invoiceId: "#INV-4025",
    vehiclePlate: "F 2233 KL",
  },
  "INV-4021": {
    id: "INV-4021",
    payerName: "Robert Fox",
    payerId: "DRV-8826",
    amount: "$150.00",
    paymentDate: "2023-10-25",
    paymentMethod: "Credit Card",
    referenceNumber: "REF-20231025-004",
    notes: "Payment for rental invoice INV-4021",
    invoiceId: "#INV-4021",
    vehiclePlate: "A 5544 BC",
  },
  "INV-4031": {
    id: "INV-4031",
    payerName: "Frank Lee",
    payerId: "DRV-8831",
    amount: "$430.00",
    paymentDate: "2023-10-29",
    paymentMethod: "Cash",
    referenceNumber: "REF-20231029-009",
    notes: "Payment for rental invoice INV-4031",
    invoiceId: "#INV-4031",
    vehiclePlate: "B 6666 OP",
  },
  "INV-4032": {
    id: "INV-4032",
    payerName: "Grace Kim",
    payerId: "DRV-8832",
    amount: "$1,500.00",
    paymentDate: "2023-10-30",
    paymentMethod: "Transfer",
    referenceNumber: "REF-20231030-010",
    notes: "Payment for rental invoice INV-4032",
    invoiceId: "#INV-4032",
    vehiclePlate: "D 7777 QR",
  },
};


const ManualPaymentPage = () => {
  const searchParams = useSearchParams();
  const paymentIdParam = searchParams.get("id");

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPayer, setSelectedPayer] = useState<{name: string; id: string} | null>(null);

   useEffect(() => {
    if (paymentIdParam && mockPayments[paymentIdParam]) {
      const payment = mockPayments[paymentIdParam];
      setMode("edit");
      setSearchValue(payment.payerName);
      setSelectedPayer({ name: payment.payerName, id: payment.payerId });
      setPaymentDate(payment.paymentDate);
      setReferenceNumber(payment.referenceNumber);
      setPaymentMethod(payment.paymentMethod);
      setAmount(payment.amount);
      setNotes(payment.notes || "");
    } else {
      setMode("add");
      setSearchValue("");
      setSelectedPayer(null);
      setPaymentDate("");
      setReferenceNumber("");
      setPaymentMethod("");
      setAmount("");
      setNotes("");
    }
  }, [paymentIdParam]);

  const handleSubmit = async () => {
    if (!selectedPayer) {
      alert("Please select a payer");
      return;
    }
    if (!paymentDate) {
      alert("Please select payment date");
      return;
    }
    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }
    if (!amount) {
      alert("Please enter amount");
      return;
    }

    setIsSubmitting(true);

    const paymentData = {
      id: paymentIdParam || undefined,
      payerName: selectedPayer.name,
      payerId: selectedPayer.id,
      paymentDate,
      referenceNumber,
      paymentMethod,
      amount,
      notes,
      timestamp: new Date().toISOString(),
    };

    console.log("Payment Data:", paymentData);

    if (mode === "edit") {
      console.log("Updating payment:", paymentIdParam);
      alert(`Payment for ${selectedPayer.name} updated successfully!`);
    } else {
      console.log("Creating new payment");
      alert(`Payment for ${selectedPayer.name} created successfully!`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    window.location.href = "/dashboard/finance";
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      window.location.href = "/dashboard/finance";
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setSelectedPayer(null);
    setPaymentDate("");
    setReferenceNumber("");
    setPaymentMethod("");
    setAmount("");
    setNotes("");
  };

  // UBAH INI (update selected payer)
  const handlePayerSelect = (name: string, id: string) => {
    setSelectedPayer({ name, id });
  };


  return (
    <div className="m-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PayerInfo
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onPayerSelect={handlePayerSelect}  // TAMBAHKAN INI
            selectedPayerId={selectedPayer?.id} 
          />
          <TransactionDetail
            paymentDate={paymentDate}
            referenceNumber={referenceNumber}
            paymentMethod={paymentMethod}
            amount={amount}
            notes={notes}
            onPaymentDateChange={setPaymentDate}
            onReferenceNumberChange={setReferenceNumber}
            onPaymentMethodChange={setPaymentMethod}
            onAmountChange={setAmount}
            onNotesChange={setNotes}
          />
        </div>
        <Summary
           payerName={selectedPayer?.name || ""}
          payerId={selectedPayer?.id || ""}
          paymentDate={paymentDate}
          paymentMethod={paymentMethod}
          amount={amount}
          currentBalance={-3500000}
          onSubmit={handleSubmit}  // TAMBAHKAN INI
          onCancel={handleCancel}   // TAMBAHKAN INI
          onClear={handleClear}      // TAMBAHKAN INI
          isSubmitting={isSubmitting} // TAMBAHKAN INI
          mode={mode}                // TAMBAHKAN INI
        />
      </div>
    </div>
  );
};

export default ManualPaymentPage;
