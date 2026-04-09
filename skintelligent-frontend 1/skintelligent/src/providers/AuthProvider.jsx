import { createContext, useContext } from "react";

import { useSessionQuery } from "../api/hooks";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const sessionQuery = useSessionQuery();
  const user = sessionQuery.data ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading: sessionQuery.isLoading,
        error: sessionQuery.error,
        refetch: sessionQuery.refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
