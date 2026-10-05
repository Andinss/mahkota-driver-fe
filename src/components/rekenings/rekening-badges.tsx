import { Badge } from "@/components/ui/badge";
import type { RekeningType } from "@/lib/types/rekening";

interface RekeningStatusBadgeProps {
  isActive: boolean;
}

export const RekeningStatusBadge = ({ isActive }: RekeningStatusBadgeProps) => (
  <Badge variant={isActive ? "success" : "neutral"} dot>
    {isActive ? "Aktif" : "Nonaktif"}
  </Badge>
);

interface RekeningTypeBadgeProps {
  type: RekeningType;
}

export const RekeningTypeBadge = ({ type }: RekeningTypeBadgeProps) =>
  type === "utama" ? (
    <Badge variant="info" size="sm">
      Rekening Utama
    </Badge>
  ) : (
    <Badge variant="neutral" size="sm">
      Reguler
    </Badge>
  );