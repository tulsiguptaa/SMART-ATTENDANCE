import React, { createContext, useContext } from "react";
import { useAuth as useProvideAuth } from "../hooks/useAuth.jsx";

// Create context
const AuthContext = createContext();

// Provider component to wrap your app
export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth(); // use your custom hook
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook to access context in components
export const useAuth = () => {
  return useContext(AuthContext);
};
