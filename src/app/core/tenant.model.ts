export interface UserRequest {
  fullname: string;
  email: string;
  phoneNumber: string;
}

export interface UserResponse {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
}

export interface TenantResponse {
  id: number;
  userId: number;
  userEmail: string;
  userFullname: string;
  userPhoneNumber: string;
  propertyId: number | null;
  propertyTitle: string | null;
  startDate: string | null;
  endDate: string | null;
  depositAmount: number | null;
  contractUrl: string | null;
}


export interface Paginated<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}