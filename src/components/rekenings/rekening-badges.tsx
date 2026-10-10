import { Badge } from "@/components/ui/badge";
import type { RekeningMethod } from "@/lib/types/rekening";

interface RekeningStatusBadgeProps {
  isActive: boolean;
}

export const RekeningStatusBadge = ({ isActive }: RekeningStatusBadgeProps) => (
  <Badge variant={isActive ? "success" : "neutral"} dot>
    {isActive ? "Aktif" : "Nonaktif"}
  </Badge>
);

const methodStyles: Record<
  RekeningMethod,
  { label: string; icon: string; variant: "warning" | "info" | "success" }
> = {
  qris: { label: "QRIS", icon: "qr_code_scanner", variant: "warning" },
  bank: { label: "Bank", icon: "account_balance", variant: "info" },
  e_wallet: { label: "E-Wallet", icon: "account_balance_wallet", variant: "success" },
};

interface RekeningMethodBadgeProps {
  method: RekeningMethod;
}

export const RekeningMethodBadge = ({ method }: RekeningMethodBadgeProps) => {
  const { label } = methodStyles[method];
  return <Badge variant={methodStyles[method].variant}>{label}</Badge>;
};

/** Ikon & warna aksen yang mengikuti tipe metode. */
export const methodMeta = (method: RekeningMethod) => methodStyles[method];