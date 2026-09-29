import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { Membership } from "../types/membership";

export interface CreateMembershipPayload {
  name: string;
  level: number;
  fee: number;
  description?: string;
  benefits?: string[];
  is_active?: boolean;
}

export interface UpdateMembershipPayload {
  name?: string;
  level?: number;
  fee?: number;
  description?: string;
  benefits?: string[];
  is_active?: boolean;
}

const normalize = (membership: Membership): Membership => ({
  ...membership,
  level: Number(membership.level),
  fee: Number(membership.fee),
  description: membership.description ?? "",
  benefits: Array.isArray(membership.benefits) ? membership.benefits : [],
});

export const membershipApi = {
  getList: async () => {
    const res = await api.get<SuccessResponse<Membership[]>>("/memberships");
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data.map(normalize) : [],
    };
  },

  getById: async (id: string) => {
    const res = await api.get<SuccessResponse<Membership>>(`/memberships/${id}`);
    return { ...res, data: normalize(res.data) };
  },

  create: async (payload: CreateMembershipPayload) => {
    const res = await api.post<SuccessResponse<Membership>>("/memberships", payload);
    return { ...res, data: normalize(res.data) };
  },

  update: async (id: string, payload: UpdateMembershipPayload) => {
    const res = await api.patch<SuccessResponse<Membership>>(
      `/memberships/${id}`,
      payload,
    );
    return { ...res, data: normalize(res.data) };
  },

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/memberships/${id}`),
};
