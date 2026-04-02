import FinancialRental from "@/components/rent/new-rent/financial-rental";
import Period from "@/components/rent/new-rent/rental-period";
import SelectionForm from "@/components/rent/new-rent/selection";
import Summary from "@/components/rent/new-rent/summry";
import UploadDocument from "@/components/rent/new-rent/upload-document";

const NewRentPage = () => {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Form Sections */}
        <div className="flex-1 space-y-8 pb-20">
          {/* Section 1: Selection */}
          <SelectionForm />
          {/* Section 2: Period */}
          <Period />
          {/* Section 3: Financials */}
          <FinancialRental />
          {/* Section 4: Documentation */}
          <UploadDocument />
        </div>

        {/* Summary Sidebar */}
        <Summary />
      </div>
    </div>
  );
};
export default NewRentPage;
