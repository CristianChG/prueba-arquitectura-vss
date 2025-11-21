import React from "react";
import { ThemeProvider } from "@providers/ThemeProvider";
import { AuthProvider } from "@providers/AuthProvider";
import { AppRoutes } from "@routes/index";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
