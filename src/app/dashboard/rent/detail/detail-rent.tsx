import CardCarInfo from "@/components/rent/detail/car-info";
import DriverInfo from "@/components/rent/detail/driver-info";
import Duration from "@/components/rent/detail/duration";
import DocumentSign from "@/components/rent/detail/signed-document";
import { Button } from "@/components/ui/button";

const DetailRentPage = () => {
  return (
    <div className="m-8">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Large Vehicle Card (Span 8) */}
        <CardCarInfo />

        {/* Driver Information (Span 4) */}
        <DriverInfo />

        {/* Duration & Rates (Span 7) */}
        <Duration />

        {/* Documents Section (Span 5) */}
        <div className="col-span-12 lg:col-span-5">
          <DocumentSign />
        </div>
      </div>

      {/* Contextual Actions */}
      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pb-8">
        <Button>Log Incident</Button>
        <Button>Generate Return Report</Button>
      </div>
    </div>
  );
};

export default DetailRentPage;
