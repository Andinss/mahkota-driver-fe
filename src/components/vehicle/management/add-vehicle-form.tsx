import { VehicleForm, VehicleData } from "./vehicle-form";

interface AddVehicleFormProps {
  isExpanded?: boolean;
  onAdd?: (data: VehicleData) => void;
  onCancel?: () => void;
}

export const AddVehicleForm = ({ isExpanded = false, onAdd, onCancel }: AddVehicleFormProps) => {
  if (!isExpanded) return null;

  return (
    <div id="add-vehicle-form">
      <VehicleForm
        mode="add"
        onSubmit={onAdd || (() => {})}
        onCancel={onCancel || (() => {})}
      />
    </div>
  );
};
