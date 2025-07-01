import { useState, useEffect, useCallback } from "react";
import { User, LoginCredentials, RegisterData } from "../types";
import { apiService, ApiError } from "../services/api";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (userData: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
      if (err instanceof ApiError && err.status !== 401) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<User> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.login(credentials);
        setUser(response.user);
        return response.user;
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (userData: RegisterData): Promise<User> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.register(userData);
        setUser(response.user);
        return response.user;
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await apiService.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if logout fails, clear user state
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
