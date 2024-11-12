import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook para acceder al contexto de autenticación.
 * Permite usar el contexto de AuthContext en los componentes para acceder a los estados y funciones de autenticación.
 *
 * @returns {object} - El valor del contexto de autenticación.
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  // Verifica si el hook se está usando fuera de un AuthProvider
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};

export default useAuth;
