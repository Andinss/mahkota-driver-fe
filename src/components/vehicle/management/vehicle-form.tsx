import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export interface VehicleData {
  make?: string;
  model?: string;
  year?: string;
  licensePlate?: string;
  color?: string;
  vin?: string;
  type?: string;
  status?: string;
}

interface VehicleFormProps {
  mode: "add" | "edit";
  initialValues?: VehicleData;
  onSubmit: (data: VehicleData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const defaultValues: VehicleData = {
  make: "",
  model: "",
  year: "",
  licensePlate: "",
  color: "",
  vin: "",
  type: "sedan",
  status: "available",
};

export const VehicleForm = ({
  mode,
  initialValues = defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: VehicleFormProps) => {
  const title = mode === "add" ? "Add New Vehicle" : "Edit Vehicle";
  const icon = mode === "add" ? "add_circle" : "edit";
  const submitButtonText = isSubmitting
    ? mode === "add"
      ? "Adding..."
      : "Updating..."
    : mode === "add"
      ? "Save Vehicle"
      : "Update Vehicle";
  const statusLabel = mode === "add" ? "Initial Status" : "Status";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: VehicleData = {
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: formData.get("year") as string,
      licensePlate: formData.get("licensePlate") as string,
      color: formData.get("color") as string,
      vin: formData.get("vin") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
    };

    onSubmit(data);
  };

  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] shadow-sm overflow-hidden">
      <div className="border-b border-[#e5e7eb] dark:border-[#2a3845] px-6 py-4 bg-[#f9fafb] dark:bg-[#111827]">
        <h2 className="text-base font-bold text-[#111418] dark:text-white flex items-center gap-2">
          <Icon name={icon} className="text-primary" />
          {title}
        </h2>
      </div>
      <div className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              id="make"
              name="make"
              label="Make"
              required
              placeholder="e.g. Toyota"
              type="text"
              defaultValue={initialValues.make}
            />
            <Input
              id="model"
              name="model"
              label="Model"
              required
              placeholder="e.g. Camry"
              type="text"
              defaultValue={initialValues.model}
            />
            <Input
              id="year"
              name="year"
              label="Year"
              required
              placeholder="e.g. 2023"
              type="number"
              min="1900"
              max="2099"
              defaultValue={initialValues.year}
            />
            <Input
              id="licensePlate"
              name="licensePlate"
              label="License Plate"
              required
              placeholder="e.g. B 1234 XYZ"
              type="text"
              className="uppercase font-mono"
              defaultValue={initialValues.licensePlate}
            />
            <Input
              id="color"
              name="color"
              label="Color"
              required
              placeholder="e.g. Silver"
              type="text"
              defaultValue={initialValues.color}
            />
            <Input
              id="vin"
              name="vin"
              label="VIN"
              required
              placeholder="Vehicle Identification Number"
              type="text"
              className="uppercase font-mono"
              defaultValue={initialValues.vin}
            />
            <Select id="type" name="type" label="Type" defaultValue={initialValues.type}>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="luxury">Luxury</option>
            </Select>
            <Select id="status" name="status" label={statusLabel} required defaultValue={initialValues.status}>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="rented">Rented (Pre-booked)</option>
            </Select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb] dark:border-[#2a3845]">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
