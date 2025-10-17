import { useState, type FormEvent } from "react";
import { useAuth } from "@hooks/useAuth";

export const RegisterForm = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "normal_user" as
      | "admin"
      | "investigator"
      | "veterinarian"
      | "normal_user",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      // En una aplicación real, aquí usarías react-router para redirigir
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Crear Cuenta</h2>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.formGroup}>
        <label htmlFor="name" style={styles.label}>
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="Juan Pérez"
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="email" style={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
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
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="confirmPassword" style={styles.label}>
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="Repite tu contraseña"
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="role" style={styles.label}>
          Tipo de usuario
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="normal_user">Usuario</option>
          <option value="veterinarian">Veterinario</option>
          <option value="admin">Administrador</option>
          <option value="investigator">Investigador</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          ...styles.button,
          ...(isLoading ? styles.buttonDisabled : {}),
        }}
      >
        {isLoading ? "Registrando..." : "Registrarse"}
      </button>

      <div style={styles.footer}>
        <a href="/login" style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
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
  select: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#28a745",
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
