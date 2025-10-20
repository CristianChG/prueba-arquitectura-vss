import { useContext } from "react";
import { AuthContext } from "@providers/AuthProvider";
import { MESSAGES } from "@constants/messages";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(MESSAGES.CONTEXT.AUTH_CONTEXT_UNDEFINED);
  }

  return context;
};
