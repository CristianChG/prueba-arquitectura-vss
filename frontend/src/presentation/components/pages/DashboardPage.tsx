// src/presentation/components/pages/DashboardPage.tsx

import { useAuth } from "../../../app/hooks/useAuth";

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>¡Bienvenido, {user?.name}!</h2>
          <div style={styles.userInfo}>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Rol:</strong> {user?.role}
            </p>
            <p>
              <strong>ID:</strong> {user?.id}
            </p>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Información</h3>
          <p style={styles.cardText}>
            Has iniciado sesión correctamente. Este es un dashboard protegido
            que solo pueden ver usuarios autenticados.
          </p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: "1rem 2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  main: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  welcomeCard: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "1.5rem",
  },
  welcomeTitle: {
    fontSize: "1.75rem",
    color: "#333",
    marginBottom: "1rem",
  },
  userInfo: {
    color: "#666",
    lineHeight: "1.8",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "1.25rem",
    color: "#333",
    marginBottom: "1rem",
  },
  cardText: {
    color: "#666",
    lineHeight: "1.6",
  },
};
