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

export interface DriverDetail {
  id: string;
  name: string;
  imageUrl: string;
  joinedDate: string;
  employeeId: string;
  phoneNumber: string;
  licenseType: string;
  totalTrips: number;
  status: DriverStatus;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  citizenship: string;
  email: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  permanentAddress: string;
  addressType: string;
  readySignContract: string;
  willingToBeSurveyed: string;
}

export interface CreateDriverPayload {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  employee_id: string;
  phone: string;
  email: string;
  emergency_contact: string;
  emergency_email: string;
  house_type: string;
  permanent_address: string;
  ready_sign_contract: string;
  willing_to_be_survey: string;
}
