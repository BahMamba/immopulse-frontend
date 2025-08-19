export interface LoginResponse {
  token: string;
  email: string;
  role: 'ADMIN' | 'OWNER';
}

export interface UserProfile {
  fullname: string;
  email: string;
  role: 'ADMIN' | 'OWNER';
}