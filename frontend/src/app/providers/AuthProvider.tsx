import { createContext, useState, useEffect, type ReactNode } from "react";
import type { User, LoginCredentials, RegisterData } from "@entities/User";
import AuthAPI from "@api/AuthAPI";
import { LoginUser } from "@usecases/LoginUser";
import { RegisterUser } from "@usecases/RegisterUser";
import { LogoutUser } from "@usecases/LogoutUser";
import { GetCurrentUser } from "@usecases/GetCurrentUser";
import { LocalStorageService } from "@storage/LocalStorageService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Instanciar repositorio y casos de uso
  const authRepository = new AuthAPI();
  const loginUseCase = new LoginUser(authRepository);
  const registerUseCase = new RegisterUser(authRepository);
  const logoutUseCase = new LogoutUser(authRepository);
  const getCurrentUserUseCase = new GetCurrentUser(authRepository);

  // Verificar autenticación al cargar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = LocalStorageService.getAccessToken();

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verificar si el token está expirado
        if (LocalStorageService.isTokenExpired(token)) {
          LocalStorageService.clearAll();
          setIsLoading(false);
          return;
        }

        // Obtener usuario del localStorage
        const storedUser = LocalStorageService.getUser();

        if (storedUser) {
          setUser(storedUser);
        } else {
          // Si no hay usuario en localStorage, obtenerlo del servidor
          const currentUser = await getCurrentUserUseCase.execute();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        LocalStorageService.clearAll();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { user: loggedUser } = await loginUseCase.execute(credentials);
      setUser(loggedUser);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { user: registeredUser } = await registerUseCase.execute(data);
      setUser(registeredUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUseCase.execute();
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Limpiar estado local aunque falle la petición
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUserUseCase.execute();
      setUser(currentUser);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
