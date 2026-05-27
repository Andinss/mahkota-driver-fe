export type DriverStatus = "Active" | "On Leave" | "Inactive";

export interface DriverItem {
  id: string;
  name: string;
  imageUrl: string;
  joinedDate: string;
  employeeId: string;
  phoneNumber: string;
  licenseType: string;
  totalTrips: number;
  status: DriverStatus;
}

export interface DriverListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  performance?: string;
}
