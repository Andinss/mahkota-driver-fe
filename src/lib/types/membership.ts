export interface Membership {
  id: string;
  level: number;
  name: string;
  fee: number;
  description: string;
  benefits: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type MembershipInput = Omit<Membership, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
