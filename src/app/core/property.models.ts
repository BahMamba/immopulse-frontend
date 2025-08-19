// Property Item
export interface PropertyListItem {
  id: number;
  title: string;
  address: string;
  price: number;
  type: string;
  status: string;
  coverImageUrl: string | null;
}

// Property Detail
export interface PropertyDetail {
  id: number;
  title: string;
  description: string;
  address: string;
  price: number;
  type: string;
  status: string;
  coverImageUrl: string | null;
  ownerFullname: string;
  ownerEmail: string;
  images: string[];
}

// Pagination
export interface PaginatedProperties<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}