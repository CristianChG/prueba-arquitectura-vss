// src/app/App.tsx

import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "../presentation/components/pages/LoginPage";
import { RegisterPage } from "../presentation/components/pages/RegisterPage";
import { DashboardPage } from "../presentation/components/pages/DashboardPage";

// Este es un ejemplo simple sin react-router
// En producción, deberías usar react-router-dom
function App() {
  const path = window.location.pathname;

  return (
    <AuthProvider>
      {path === "/login" && <LoginPage />}
      {path === "/register" && <RegisterPage />}
      {path === "/dashboard" && (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      )}
      {path === "/" && (
        <div style={styles.container}>
          <h1>Bienvenido</h1>
          <div style={styles.links}>
            <a href="/login" style={styles.link}>
              Iniciar Sesión
            </a>
            <a href="/register" style={styles.link}>
              Registrarse
            </a>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  links: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  link: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "500",
  },
};

export default App;
