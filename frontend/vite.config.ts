import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src/app"),
      "@assets": path.resolve(__dirname, "./src/app/assets"),
      "@hooks": path.resolve(__dirname, "./src/app/hooks"),
      "@providers": path.resolve(__dirname, "./src/app/providers"),
      "@routes": path.resolve(__dirname, "./src/app/routes"),
      "@domain": path.resolve(__dirname, "./src/domain"),
      "@entities": path.resolve(__dirname, "./src/domain/entities"),
      "@factories": path.resolve(__dirname, "./src/domain/factories"),
      "@repositories": path.resolve(__dirname, "./src/domain/repositories"),
      "@usecases": path.resolve(__dirname, "./src/domain/usecases"),
      "@validations": path.resolve(__dirname, "./src/domain/validations"),
      "@infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      "@adapters": path.resolve(__dirname, "./src/infrastructure/adapters"),
      "@api": path.resolve(__dirname, "./src/infrastructure/api"),
      "@storage": path.resolve(__dirname, "./src/infrastructure/storage"),
      "@presentation": path.resolve(__dirname, "./src/presentation"),
      "@components": path.resolve(__dirname, "./src/presentation/components"),
      "@atoms": path.resolve(__dirname, "./src/presentation/components/atoms"),
      "@molecules": path.resolve(
        __dirname,
        "./src/presentation/components/molecules"
      ),
      "@organisms": path.resolve(
        __dirname,
        "./src/presentation/components/organisms"
      ),
      "@pages": path.resolve(__dirname, "./src/presentation/components/pages"),
      "@templates": path.resolve(
        __dirname,
        "./src/presentation/components/templates"
      ),
      "@styles": path.resolve(__dirname, "./src/presentation/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@constants": path.resolve(__dirname, "./src/utils/constants"),
      "@formatters": path.resolve(__dirname, "./src/utils/formatters"),
      "@validators": path.resolve(__dirname, "./src/utils/validators"),
    },
  },
});
