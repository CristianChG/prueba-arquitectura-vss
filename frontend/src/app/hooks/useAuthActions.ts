import { useState, useCallback, useEffect } from "react";
import { AuthRepositoryAdapter } from "@adapters/AuthRepositoryAdapter";
import { LocalStorageService } from "@storage/LocalStorageService";
import { LoginUser } from "@usecases/LoginUser";
import { RegisterUserUseCase } from "@usecases/RegisterUser";
import { LogoutUser } from "@usecases/LogoutUser";
import type { User } from "@entities/User";

export function useAuthActions() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authRepository = new AuthRepositoryAdapter();
  const storage = new LocalStorageService();

  const loginUseCase = new LoginUser(authRepository);
  const registerUseCase = new RegisterUserUseCase(authRepository);
  const logoutUseCase = new LogoutUser(authRepository);

  const initializeAuth = useCallback(async () => {
    try {
      const accessToken = storage.getAccessToken();
      if (accessToken) {
        const currentUser = await authRepository.getCurrentUser();
        setUser(currentUser);
      }
    } catch {
      storage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginUseCase.execute(email, password);
      const currentUser = await authRepository.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const newUser = await registerUseCase.execute(email, password, name);
        setUser(newUser);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutUseCase.execute();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
