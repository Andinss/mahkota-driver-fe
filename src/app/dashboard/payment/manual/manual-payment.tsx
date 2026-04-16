"use client";

import { useState } from "react";
import PayerInfo from "@/components/payment/manual/payer-info";
import Summary from "@/components/payment/manual/summary";
import TransactionDetail from "@/components/payment/manual/transaction-detail";

const ManualPaymentPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="m-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PayerInfo
            searchValue={searchValue}
            onSearchChange={setSearchValue}
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
          payerName="John Doe"
          payerId="DRV-8821"
          paymentDate={paymentDate}
          paymentMethod={paymentMethod}
          amount={amount}
          currentBalance={-3500000}
        />
      </div>
    </div>
  );
};

export default ManualPaymentPage;
