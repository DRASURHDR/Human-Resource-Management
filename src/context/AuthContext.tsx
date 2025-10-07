import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { login as loginRequest, register as registerRequest } from '../lib/api';
import type { RegistrationData, AuthUser } from '../types/auth';

interface LoginCredentials {
  email: string;
  password: string;
  keepLoggedIn?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
  register: (data: RegistrationData) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_KEY = 'auth_user';
const KEEP_LOGGED_IN_KEY = 'auth_keep_logged_in';

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && typeof parsed.id === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = readStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setInitializing(false);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthUser> => {
      setLoading(true);
      try {
        const authenticatedUser = await loginRequest({
          email: credentials.email,
          password: credentials.password,
        });
        setUser(authenticatedUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));
        if (credentials.keepLoggedIn) {
          localStorage.setItem(KEEP_LOGGED_IN_KEY, 'true');
        } else {
          localStorage.removeItem(KEEP_LOGGED_IN_KEY);
        }
        return authenticatedUser;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback((): void => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(KEEP_LOGGED_IN_KEY);
  }, []);

  const register = useCallback(async (data: RegistrationData): Promise<AuthUser> => {
    setLoading(true);
    try {
      return await registerRequest(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      logout,
      register,
    }),
    [user, loading, login, logout, register],
  );

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">Loading session...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};