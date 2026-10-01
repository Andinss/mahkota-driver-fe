import { Badge } from "@/components/ui/badge";

interface MembershipStatusBadgeProps {
  isActive: boolean;
}

export const MembershipStatusBadge = ({ isActive }: MembershipStatusBadgeProps) => (
  <Badge variant={isActive ? "success" : "neutral"} dot>
    {isActive ? "Aktif" : "Nonaktif"}
  </Badge>
);
