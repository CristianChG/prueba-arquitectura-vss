import { LoginForm } from "@organisms/LoginForm";

export const LoginPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <LoginForm />
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: "1rem",
  },
  content: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
};
