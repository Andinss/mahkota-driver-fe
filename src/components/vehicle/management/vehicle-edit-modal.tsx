import { Modal } from "@/components/ui/modal";
import { VehicleForm, VehicleData } from "./vehicle-form";

interface VehicleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleData: VehicleData;
  onUpdate: (data: VehicleData) => void;
  isSubmitting?: boolean;
}

export const VehicleEditModal = ({
  isOpen,
  onClose,
  vehicleData,
  onUpdate,
  isSubmitting = false,
}: VehicleEditModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Vehicle"
      size="lg"
    >
      <VehicleForm
        mode="edit"
        initialValues={vehicleData}
        onSubmit={onUpdate}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
};
