export type AuthView = 'login' | 'forgot-password' | 'register';

export type RegisterStep =
  | 'personal'
  | 'role'
  | 'designation'
  | 'account'
  | 'congratulations';

export interface RegistrationData {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  department: string;
  position: string;
  description: string;
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
}