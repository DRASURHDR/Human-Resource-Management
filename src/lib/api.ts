import { sleep } from './sleep';
import type { RegistrationData, AuthUser } from '../types/auth';

const API_DELAY = 600;
const REGISTERED_USERS_KEY = 'registered_users';

export interface LoginPayload {
  email: string;
  password: string;
}

const emailPattern = /\S+@\S+\.\S+/;

interface StoredUser extends RegistrationData {
  id: string;
}

const readStoredUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as StoredUser[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
};

const persistUsers = (users: StoredUser[]): void => {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

export const login = async ({ email, password }: LoginPayload): Promise<AuthUser> => {
  await sleep(API_DELAY);
  if (!emailPattern.test(email) || password.trim().length < 6) {
    throw new Error('Invalid email or password.');
  }

  const accounts = readStoredUsers();
  const matched = accounts.find((account) => account.email.toLowerCase() === email.toLowerCase());

  if (!matched) {
    throw new Error('No account found with this email. Please register first.');
  }

  if (matched.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  return {
    id: matched.id,
    username: matched.username,
    fullName: matched.fullName,
  };
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await sleep(API_DELAY);
  if (!emailPattern.test(email)) {
    throw new Error('Please enter a valid email address.');
  }
};

export const register = async (data: RegistrationData): Promise<AuthUser> => {
  await sleep(API_DELAY);

  const trimmed: RegistrationData = {
    ...data,
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    phoneNumber: data.phoneNumber.trim(),
    role: data.role.trim(),
    department: data.department.trim(),
    position: data.position.trim(),
    description: data.description.trim(),
    username: data.username.trim(),
    password: data.password.trim(),
  };

  if (!emailPattern.test(trimmed.email)) {
    throw new Error('Please provide a valid email address.');
  }

  if (trimmed.password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const accounts = readStoredUsers();

  if (accounts.some((account) => account.email.toLowerCase() === trimmed.email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }

  if (accounts.some((account) => account.username.toLowerCase() === trimmed.username.toLowerCase())) {
    throw new Error('This username is already taken.');
  }

  const newAccount: StoredUser = {
    ...trimmed,
    id: `user-${Date.now()}`,
  };

  persistUsers([...accounts, newAccount]);

  return {
    id: newAccount.id,
    username: newAccount.username,
    fullName: newAccount.fullName,
  };
};