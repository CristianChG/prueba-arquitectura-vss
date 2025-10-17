import { useState, type FormEvent } from "react";
import { useAuth } from "@hooks/useAuth";

export const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
      // En una aplicación real, aquí usarías react-router para redirigir
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Iniciar Sesión</h2>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.formGroup}>
        <label htmlFor="email" style={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
          placeholder="tu@email.com"
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="password" style={styles.label}>
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          ...styles.button,
          ...(isLoading ? styles.buttonDisabled : {}),
        }}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>

      <div style={styles.footer}>
        <a href="/register" style={styles.link}>
          ¿No tienes cuenta? Regístrate
        </a>
      </div>
    </form>
  );
};

const styles = {
  form: {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textAlign: "center" as const,
    color: "#333",
  },
  error: {
    padding: "0.75rem",
    marginBottom: "1rem",
    backgroundColor: "#fee",
    border: "1px solid #fcc",
    borderRadius: "4px",
    color: "#c33",
    fontSize: "0.875rem",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
  },
  footer: {
    marginTop: "1rem",
    textAlign: "center" as const,
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "0.875rem",
  },
};
