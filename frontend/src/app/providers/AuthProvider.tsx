import React from "react";
import { AuthContext } from "@app/context/AuthContext";
import { useAuthActions } from "@hooks/useAuthActions";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useAuthActions();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
