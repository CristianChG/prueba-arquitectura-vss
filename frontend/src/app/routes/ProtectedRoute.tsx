// src/app/routes/ProtectedRoute.tsx

import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user" | "veterinarian";
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // En una aplicación real, aquí usarías react-router para redirigir
    window.location.href = "/login";
    return null;
  }

  // Verificar rol si es requerido
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>No tienes permisos para acceder a esta página</div>
      </div>
    );
  }

  return <>{children}</>;
};
