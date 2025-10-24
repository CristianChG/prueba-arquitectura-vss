import React from "react";
import { AuthProvider } from "@providers/AuthProvider";
import { AppRoutes } from "@routes/index";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
