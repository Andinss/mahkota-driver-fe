import { Badge } from "@/components/ui/badge";

type PaymentStatus = "paid" | "pending" | "refunded";

interface PaymentBadgeProps {
  status: PaymentStatus;
}

export const PaymentBadge = ({ status }: PaymentBadgeProps) => {
  const variant: Record<PaymentStatus, "success" | "warning" | "danger"> = {
    paid: "success",
    pending: "warning",
    refunded: "danger",
  };

  return (
    <Badge variant={variant[status]} dot>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
